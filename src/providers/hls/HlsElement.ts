import type Hls from 'hls.js';
import type {
  ErrorData,
  ErrorTypes,
  Events as HlsEvent,
  HlsConfig,
  LevelLoadedData
} from 'hls.js';
import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { VdsEvent, vdsEvent } from '../../base/events';
import { CanPlay, MediaType } from '../../media';
import { preconnect } from '../../utils/network';
import { isHlsjsSupported } from '../../utils/support';
import { isNil, isString, isUndefined } from '../../utils/unit';
import { VideoElement } from '../video';
import type { DynamicHlsConstructorImport, HlsConstructor } from './types';
import {
  HlsConstructorLoadCallbacks,
  importHlsConstructor,
  isHlsConstructorCached,
  isHlsEventType,
  loadHlsConstructorScript,
  vdsToHlsEventType
} from './utils';

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

export const HLS_TYPES = new Set([
  'application/x-mpegURL',
  'application/vnd.apple.mpegurl'
]);

const HLS_CDN_SRC_BASE = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls';
const HLS_CDN_SRC_DEV = `${HLS_CDN_SRC_BASE}.js` as const;
const HLS_CDN_SRC_PROD = `${HLS_CDN_SRC_BASE}.min.js` as const;

/**
 * Embeds video content into documents via the native `<video>` element. It may contain
 * one or more video sources, represented using the `src` attribute or the `<source>` element: the
 * browser will choose the most suitable one.
 *
 * In addition, this element introduces support for HLS streaming via the popular `hls.js` library.
 * HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * 💡 This element contains the exact same interface as the `<video>` element. It re-dispatches
 * all the native events if needed, but prefer the `vds-*` variants (eg: `vds-play`) as they
 * iron out any browser issues. It also dispatches all the `hls.js` events.
 *
 * 💡 This element re-dispatches all `hls.js` events so you can listen for them through the
 * native DOM interface (eg: `addEventListener('vds-hls-media-attaching', ...)`).
 *
 * @tagname vds-hls
 * @slot Used to pass in `<source>` and `<track>` elements to the underlying HTML5 media player.
 * @csspart media - The video element (`<video>`).
 * @csspart video - Alias for `media` part.
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <!-- Additional media resources here. -->
 * </vds-hls>
 * ```
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 * </vds-hls>
 * ```
 */
export class HlsElement extends VideoElement {
  protected _hlsEngine: Hls | undefined;
  protected _isHlsEngineAttached = false;

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The `hls.js` configuration object.
   */
  @property({ type: Object, attribute: 'hls-config' })
  hlsConfig: Partial<HlsConfig | undefined> = {};

  // @see https://github.com/vidstack/player/issues/583
  @property()
  set ['hls-config'](config) {
    this.hlsConfig = config;
  }

  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @default DEV: 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.js'
   * @default PROD: 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js'
   */
  @property({ attribute: 'hls-library' })
  hlsLibrary:
    | HlsConstructor
    | DynamicHlsConstructorImport
    | string
    | undefined = __DEV__ ? HLS_CDN_SRC_DEV : HLS_CDN_SRC_PROD;

  // @see https://github.com/vidstack/player/issues/583
  @property()
  set ['hls-library'](lib) {
    this.hlsLibrary = lib;
  }

  protected _Hls: HlsConstructor | undefined;

  /**
   * The `hls.js` constructor.
   */
  get Hls() {
    return this._Hls;
  }

  /**
   * The current `hls.js` instance.
   */
  get hlsEngine() {
    return this._hlsEngine;
  }

  /**
   * Whether the `hls.js` instance has mounted the `HtmlMediaElement`.
   *
   * @default false
   */
  get isHlsEngineAttached() {
    return this._isHlsEngineAttached;
  }

  override get currentSrc() {
    return this.isHlsStream && !this.shouldUseNativeHlsSupport
      ? this.src
      : this.videoEngine?.currentSrc ?? '';
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    this._preconnectToHlsLibDownload();
  }

  protected override async update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (
      changedProperties.has('hlsLibrary') &&
      !this.shouldUseNativeHlsSupport &&
      isHlsjsSupported()
    ) {
      this._preconnectToHlsLibDownload();
    }

    if (
      changedProperties.has('hlsLibrary') &&
      this.hasUpdated &&
      this.canLoad &&
      !this.shouldUseNativeHlsSupport &&
      isHlsjsSupported()
    ) {
      await this._buildHlsEngine(true);
      this._attachHlsEngine();
      this._loadSrcOnHlsEngine();
    }
  }

  override disconnectedCallback() {
    this._destroyHlsEngine();
    super.disconnectedCallback();
  }

  override async handleMediaCanLoad() {
    await super.handleMediaCanLoad();

    if (!this._hasAttachedSourceNodes) {
      window.requestAnimationFrame(() => {
        this._handleMediaSrcChange();
      });
    }

    /**
     * We can't actually determine whether there is native HLS support until the underlying
     * `<video>` element has rendered, since we rely on calling `canPlayType` on it. Thus we retry
     * this getter here, and if it returns `true` we request an update so the `src` is set
     * on the `<video>` element (determined by `_shouldSetVideoSrcAttr()` method).
     */
    if (this.shouldUseNativeHlsSupport) {
      this.requestUpdate();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  override canPlayType(type: string): CanPlay {
    if (HLS_TYPES.has(type)) {
      this.isHlsSupported ? CanPlay.Probably : CanPlay.No;
    }

    return super.canPlayType(type);
  }

  /**
   * Whether HLS streaming is supported in this environment.
   */
  get isHlsSupported(): boolean {
    return (
      (this.Hls?.isSupported() ?? isHlsjsSupported()) ||
      this.hasNativeHlsSupport
    );
  }

  /**
   * Whether the current src is using HLS.
   *
   * @default false
   */
  get isHlsStream(): boolean {
    return HLS_EXTENSIONS.test(this.src);
  }

  /**
   * Whether the browser natively supports HLS, mostly only true in Safari. Only call this method
   * after the provider has connected to the DOM (wait for `MediaProviderConnectEvent`).
   */
  get hasNativeHlsSupport(): boolean {
    /**
     * We need to call this directly on `HTMLMediaElement`, calling `this.shouldPlayType(...)`
     * won't work here because it'll use the `CanPlayType` result from this provider override
     * which will incorrectly indicate that HLS can natively played due to `hls.js` support.
     */
    const canPlayType = super.canPlayType('application/vnd.apple.mpegurl');

    if (__DEV__) {
      this._logger
        ?.infoGroup('checking for native HLS support')
        .labelledLog('Can play type', canPlayType)
        .dispatch();
    }

    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  /**
   * Whether native HLS support is available and whether it should be used. Generally defaults
   * to `false` as long as `window.MediaSource` is defined to enforce consistency by
   * using `hls.js` whereever possible.
   *
   * @default false
   */
  get shouldUseNativeHlsSupport(): boolean {
    /**
     * // TODO: stage-2 we'll need to rework this line and determine when to "upgrade" to `hls.js`.
     *
     * @see https://github.com/vidstack/player/issues/376
     */
    if (isHlsjsSupported()) return false;
    return this.hasNativeHlsSupport;
  }

  /**
   * Notifies the `VideoElement` whether the `src` attribute should be set on the rendered
   * `<video>` element. If we're using `hls.js` we don't want to override the `blob`.
   */
  protected override _shouldSetVideoSrcAttr(): boolean {
    return (
      this.canLoad && (this.shouldUseNativeHlsSupport || !this.isHlsStream)
    );
  }

  // -------------------------------------------------------------------------------------------
  // Initialize hls.js
  // -------------------------------------------------------------------------------------------

  /**
   * Attempts to preconnect to the `hls.js` remote source given via `hlsLibrary`. This is
   * assuming `hls.js` is not bundled and `hlsLibrary` is a URL string pointing to where it
   * can be found.
   */
  protected _preconnectToHlsLibDownload() {
    if (
      this.canLoad ||
      !isString(this.hlsLibrary) ||
      isHlsConstructorCached(this.hlsLibrary)
    ) {
      return;
    }

    if (__DEV__) {
      this._logger
        ?.infoGroup('preconnecting to `hls.js` download')
        .labelledLog('URL', this.hlsLibrary)
        .dispatch();
    }

    preconnect(this.hlsLibrary);
  }

  protected async _buildHlsEngine(forceRebuild = false): Promise<void> {
    // Need to mount on `<video>`.
    if (
      isNil(this.videoEngine) &&
      !forceRebuild &&
      !isUndefined(this.hlsEngine)
    ) {
      return;
    }

    if (__DEV__) {
      this._logger?.info('🏗️ Building HLS engine');
    }

    // Destroy old engine.
    if (!isUndefined(this.hlsEngine)) {
      this._destroyHlsEngine();
    }

    const callbacks: HlsConstructorLoadCallbacks = {
      onLoadStart: () => {
        if (__DEV__) {
          this._logger
            ?.infoGroup('Starting to load `hls.js`')
            .labelledLog('URL', this.hlsLibrary)
            .dispatch();
        }

        this.dispatchEvent(vdsEvent('vds-hls-lib-load-start'));
      },
      onLoaded: (HlsConstructor) => {
        if (__DEV__) {
          this._logger
            ?.infoGroup('Loaded `hls.js`')
            .labelledLog('URL', this.hlsLibrary)
            .labelledLog('Library', HlsConstructor)
            .dispatch();
        }

        this.dispatchEvent(
          vdsEvent('vds-hls-lib-loaded', { detail: HlsConstructor })
        );
      },
      onLoadError: (err) => {
        if (__DEV__) {
          this._logger
            ?.infoGroup('Failed to load `hls.js`')
            .labelledLog('URL', this.hlsLibrary)
            .dispatch();
        }

        this.dispatchEvent(
          vdsEvent('vds-hls-lib-load-error', { detail: err as Error })
        );
      }
    };

    // If not a string it'll return undefined.
    this._Hls = await loadHlsConstructorScript(this.hlsLibrary, callbacks);

    // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
    if (isUndefined(this._Hls) && !isString(this.hlsLibrary)) {
      this._Hls = await importHlsConstructor(this.hlsLibrary, callbacks);
    }

    if (!this.Hls) {
      callbacks.onLoadError!(
        Error('[vds]: Failed to load `hls.js` (check `hlsLibrary`).')
      );

      return;
    } else if (!this.Hls.isSupported?.()) {
      if (__DEV__) {
        this._logger?.warn('`hls.js` is not supported in this environment');
      }

      this.dispatchEvent(vdsEvent('vds-hls-unsupported'));

      return;
    }

    this._hlsEngine = new this.Hls(this.hlsConfig);

    if (__DEV__) {
      this._logger
        ?.infoGroup('🏗️ HLS engine built')
        .labelledLog('HLS Engine', this.hlsEngine)
        .labelledLog('Video Engine', this.videoEngine)
        .dispatch();
    }

    this.dispatchEvent(
      vdsEvent('vds-hls-instance', { detail: this.hlsEngine })
    );

    this._listenToHlsEngine();
  }

  protected _destroyHlsEngine(): void {
    this.hlsEngine?.destroy();
    this._prevHlsEngineSrc = '';
    this._hlsEngine = undefined;
    this._isHlsEngineAttached = false;

    if (__DEV__) {
      this._logger?.info('🏗️ Destroyed HLS engine');
    }
  }

  protected _prevHlsEngineSrc = '';

  // Let `Html5MediaElement` know we're taking over ready events.
  protected override _willAnotherEngineAttach(): boolean {
    return this.isHlsStream && !this.shouldUseNativeHlsSupport;
  }

  protected _attachHlsEngine(): void {
    if (
      this.isHlsEngineAttached ||
      isUndefined(this.hlsEngine) ||
      isNil(this.videoEngine)
    ) {
      return;
    }

    this.hlsEngine.attachMedia(this.videoEngine);
    this._isHlsEngineAttached = true;

    if (__DEV__) {
      this._logger
        ?.infoGroup('🏗️ attached HLS engine')
        .labelledLog('HLS Engine', this._hlsEngine)
        .labelledLog('Video Engine', this.videoEngine)
        .dispatch();
    }
  }

  protected _detachHlsEngine(): void {
    if (!this.isHlsEngineAttached) return;

    this.hlsEngine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsEngineSrc = '';

    if (__DEV__) {
      this._logger
        ?.infoGroup('🏗️ detached HLS engine')
        .labelledLog('Video Engine', this.videoEngine)
        .dispatch();
    }
  }

  protected _loadSrcOnHlsEngine(): void {
    if (
      isNil(this.hlsEngine) ||
      !this.isHlsStream ||
      this.shouldUseNativeHlsSupport ||
      this.src === this._prevHlsEngineSrc
    ) {
      return;
    }

    if (__DEV__) {
      this._logger
        ?.infoGroup(`📼 loading src`)
        .labelledLog('Src', this.src)
        .labelledLog('HLS Engine', this._hlsEngine)
        .labelledLog('Video Engine', this.videoEngine)
        .dispatch();
    }

    this.hlsEngine.loadSource(this.src);
    this._prevHlsEngineSrc = this.src;
  }

  protected override _getMediaType(): MediaType {
    if (this.mediaType === MediaType.LiveVideo) {
      return MediaType.LiveVideo;
    }

    if (this.isHlsStream) {
      return MediaType.Video;
    }

    return super._getMediaType();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected override _handleLoadedMetadata(event: Event) {
    super._handleLoadedMetadata(event);
    // iOS doesn't fire `canplay` event when loading HLS videos natively.
    if (this.shouldUseNativeHlsSupport && this.isHlsStream) {
      this._handleCanPlay(event);
    }
  }

  protected override async _handleMediaSrcChange() {
    if (this._prevHlsEngineSrc === this.src) return;

    await super._handleMediaSrcChange();

    // We don't want to load `hls.js` until the browser has had a chance to paint.
    if (!this.hasUpdated || !this.canLoad) return;

    if (!this.isHlsStream) {
      this._detachHlsEngine();
      return;
    }

    // Need to wait for `src` attribute on `<video>` to clear if last `src` was not using HLS engine.
    await this.updateComplete;

    if (isNil(this.hlsLibrary) || this.shouldUseNativeHlsSupport) return;

    if (isUndefined(this.hlsEngine)) {
      await this._buildHlsEngine();
    }

    if (__DEV__) {
      this._logger?.debug(`📼 detected hls src change \`${this.src}\``);
    }

    this._attachHlsEngine();
    this._loadSrcOnHlsEngine();
  }

  protected _listenToHlsEngine(): void {
    if (isUndefined(this.hlsEngine) || isUndefined(this.Hls)) return;

    this.hlsEngine.on(
      this.Hls.Events.LEVEL_LOADED,
      this._handleHlsLevelLoaded.bind(this)
    );

    this._hlsEventListeners.forEach(({ type, listener, options }) => {
      this.hlsEngine?.[options?.once ? 'once' : 'on'](
        type,
        listener,
        options?.context
      );
    });

    this.hlsEngine.on(this.Hls.Events.ERROR, this._handleHlsError.bind(this));
  }

  protected _handleHlsError(eventType: string, data: ErrorData): void {
    if (isUndefined(this.Hls)) return;

    if (__DEV__) {
      this._logger
        ?.errorGroup(`HLS error \`${eventType}\``)
        .labelledLog('Event type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', this.src)
        .labelledLog('State', { ...this.mediaState })
        .labelledLog('HLS Engine', this._hlsEngine)
        .labelledLog('Video Engine', this.videoEngine)
        .dispatch();
    }

    if (data.fatal) {
      switch (data.type) {
        case 'networkError':
          this._handleHlsNetworkError();
          break;
        case 'mediaError':
          this._handleHlsMediaError();
          break;
        default:
          this._handleHlsIrrecoverableError();
          break;
      }
    }

    this.dispatchEvent(
      vdsEvent('vds-error', {
        triggerEvent: new VdsEvent(eventType, { detail: data })
      })
    );
  }

  protected _handleHlsNetworkError(): void {
    this.hlsEngine?.startLoad();
  }

  protected _handleHlsMediaError(): void {
    this.hlsEngine?.recoverMediaError();
  }

  protected _handleHlsIrrecoverableError(): void {
    this._destroyHlsEngine();
  }

  protected _handleHlsLevelLoaded(
    eventType: string,
    data: LevelLoadedData
  ): void {
    if (this.canPlay) return;
    this._handleHlsMediaReady(eventType, data);
  }

  protected override _mediaReadyOnMetadataLoad = true;
  protected _handleHlsMediaReady(
    eventType: string,
    data: LevelLoadedData
  ): void {
    const { live, totalduration: duration } = data.details;

    const event = new VdsEvent(eventType, { detail: data });

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.mediaState.mediaType !== mediaType) {
      this.dispatchEvent(
        vdsEvent('vds-media-type-change', {
          detail: mediaType,
          triggerEvent: event
        })
      );
    }

    if (this.duration !== duration) {
      this.dispatchEvent(
        vdsEvent('vds-duration-change', {
          detail: duration,
          triggerEvent: event
        })
      );
    }
  }

  // -------------------------------------------------------------------------------------------
  // Hls Event Listeners
  // -------------------------------------------------------------------------------------------

  protected _hlsEventListeners: {
    listener: () => void;
    type: HlsEvent;
    options?: AddEventListenerOptions & { context: any };
  }[] = [];

  override addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | (AddEventListenerOptions & { context: any })
  ): void;

  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | (AddEventListenerOptions & { context: any })
  ): void;

  override addEventListener(type: any, listener: any, options?: any): void {
    if (isHlsEventType(type)) {
      const hlsEventType = vdsToHlsEventType(type) as HlsEvent;

      const hasEventListener = this._hlsEventListeners.some(
        (l) => l.type === hlsEventType && l.listener === listener
      );

      if (!hasEventListener) {
        this._hlsEventListeners.push({ type: hlsEventType, listener, options });
        this.hlsEngine?.[options?.once ? 'once' : 'on'](
          hlsEventType,
          listener,
          options?.context
        );
      }

      return;
    }

    return super.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;

  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;

  override removeEventListener(type: any, listener: any, options?: any): void {
    if (isHlsEventType(type)) {
      const hlsEventType = vdsToHlsEventType(type) as HlsEvent;
      this._hlsEventListeners = this._hlsEventListeners.filter(
        (l) => l.type === hlsEventType && l.listener === listener
      );
      this.hlsEngine?.off(
        hlsEventType,
        listener,
        options?.context,
        options?.once
      );
      return;
    }

    return super.removeEventListener(type, listener, options);
  }
}
