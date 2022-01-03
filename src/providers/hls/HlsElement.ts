import type Hls from 'hls.js';
import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { VdsEvent, vdsEvent } from '../../base/events';
import { CanPlay, MediaType } from '../../media';
import { preconnect, ScriptLoader } from '../../utils/network';
import { isNonNativeHlsStreamingPossible } from '../../utils/support';
import { isFunction, isNil, isString, isUndefined } from '../../utils/unit';
import { VideoElement } from '../video';

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

export const HLS_TYPES = new Set([
  'application/x-mpegURL',
  'application/vnd.apple.mpegurl'
]);

export type HlsConstructor = typeof Hls;

const HLS_LIB_CACHE = new Map<string, HlsConstructor>();

/**
 * Embeds video content into documents via the native `<video>` element. It may contain
 * one or more video sources, represented using the `src` attribute or the `<source>` element: the
 * browser will choose the most suitable one.
 *
 * In addition, this element introduces support for HLS streaming via the popular `hls.js` library.
 * HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * 💡 This element contains the exact same interface as the `<video>` element. It redispatches
 * all the native events if needed, but prefer the `vds-*` variants (eg: `vds-play`) as they
 * iron out any browser issues. It also dispatches all the `hls.js` events.
 *
 * ## Dynamically Loaded
 *
 * ### CDN
 *
 * Simply point the `hlsLibrary` property or `hls-library` attribute to a script on a CDN
 * containing the library. For example, you could use the following URL
 * `https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js`. Swap `hls.js` for `hls.min.js` in
 * production.
 *
 * We recommended using either [JSDelivr](https://jsdelivr.com) or [UNPKG](https://unpkg.com).
 *
 * ```html
 * <vds-hls
 *   src="https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8"
 *   hls-library="https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js"
 * ></vds-hls>
 * ```
 *
 * ### Dynamic Import
 *
 * If you'd like to serve your own copy and control when the library is downloaded, simply
 * use [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)
 * and update the `hlsLibrary` property when ready. You must pass in the `hls.js` class constructor.
 *
 * ## Locally Bundled (not recommended)
 *
 * You'll need to install `hls.js`...
 *
 * ```bash
 * $: npm install hls.js@^0.14.0 @types/hls.js@^0.13.3
 * ```
 *
 * Finally, import it and pass it as a property to `<vds-hls>`...
 *
 * ```ts
 * import '@vidstack/elements/providers/hls/define';
 *
 * import { html, LitElement } from 'lit';
 * import Hls from 'hls.js';
 *
 * class MyElement extends LitElement {
 *   render() {
 *     return html`<vds-hls src="..."  .hlsLibrary=${Hls}></vds-hls>`;
 *   }
 * }
 * ```
 *
 * @tagname vds-hls
 * @slot Used to pass in `<source>` and `<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
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
  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The `hls.js` configuration object.
   */
  @property({ type: Object, attribute: 'hls-config' })
  hlsConfig: Partial<Hls.Config | undefined> = {};

  /**
   * The `hls.js` constructor or a URL of where it can be found. Only version `^0.13.3`
   * (note the `^`) is supported at the moment. Important to note that by default this is
   * `undefined` so you can freely optimize when the best possible time is to load the library.
   */
  @property({ attribute: 'hls-library' })
  hlsLibrary: HlsConstructor | string | undefined;

  protected _Hls: HlsConstructor | undefined;

  /**
   * The `hls.js` constructor.
   */
  get Hls() {
    return this._Hls;
  }

  protected _hlsEngine: Hls | undefined;

  protected _isHlsEngineAttached = false;

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
    this._initiateHlsLibraryDownloadConnection();
  }

  protected override async update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (
      changedProperties.has('hlsLibrary') &&
      this.hasUpdated &&
      !this.shouldUseNativeHlsSupport
    ) {
      this._initiateHlsLibraryDownloadConnection();
      await this._buildHlsEngine(true);
      this._attachHlsEngine();
      this._loadSrcOnHlsEngine();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    // TODO(mihar-22): Add a lazy load option to wait until in viewport.
    // Wait a frame to ensure the browser has had a chance to reach first-contentful-paint.
    window.requestAnimationFrame(() => {
      this._handleMediaSrcChange();
    });

    /**
     * We can't actually determine whether there is native HLS support until the undlerying
     * `<video>` element has rendered, since we rely on calling `canPlayType` on it. Thus we retry
     * this getter here, and if it returns `true` we request an update so the `src` is set
     * on the `<video>` element (determined by `_shouldSetVideoSrcAttr()` method).
     */
    if (this.shouldUseNativeHlsSupport) {
      this.requestUpdate();
    }
  }

  override disconnectedCallback() {
    this._destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * Attempts to preconnect to the `hls.js` remote source given via `hlsLibrary`. This is
   * assuming `hls.js` is not bundled and `hlsLibrary` is a URL string pointing to where it
   * can be found.
   */
  protected _initiateHlsLibraryDownloadConnection() {
    if (!isString(this.hlsLibrary) || HLS_LIB_CACHE.has(this.hlsLibrary)) {
      return;
    }

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup('preconnect to `hls.js` download')
        .appendWithLabel('URL', this.hlsLibrary)
        .end();
    }
    /* c8 ignore stop */

    preconnect(this.hlsLibrary);
  }

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
      (this.Hls?.isSupported() ?? isNonNativeHlsStreamingPossible()) ||
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

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .debugGroup('checking for native HLS support')
        .appendWithLabel('Can play type', canPlayType)
        .end();
    }
    /* c8 ignore stop */

    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  /**
   * Whether native HLS support is available and whether it should be used. Generally defaults
   * to `false` as long as `window.MediaSource` is defined to enforce consistency by
   * using `hls.js` where ever possible.
   *
   * @default false
   */
  get shouldUseNativeHlsSupport(): boolean {
    /**
     * // TODO: stage-2 we'll need to rework this line and determine when to "upgrade" to `hls.js`.
     *
     * @see https://github.com/vidstack/elements/issues/376
     */
    if (isNonNativeHlsStreamingPossible()) return false;
    return this.hasNativeHlsSupport;
  }

  /**
   * Notifies the `VideoElement` whether the `src` attribute should be set on the rendered
   * `<video>` element. If we're using `hls.js` we don't want to override the `blob`.
   */
  protected override _shouldSetVideoSrcAttr(): boolean {
    return this.shouldUseNativeHlsSupport || !this.isHlsStream;
  }

  /**
   * Loads `hls.js` from a remote source found at the `hlsLibrary` URL (if a string).
   */
  protected async _loadHlsLibrary(): Promise<void> {
    if (!isString(this.hlsLibrary) || HLS_LIB_CACHE.has(this.hlsLibrary)) {
      return;
    }

    const HlsConstructor = await this._loadHlsScript();

    // Loading failed.
    if (isUndefined(HlsConstructor)) return;

    HLS_LIB_CACHE.set(this.hlsLibrary, HlsConstructor);

    this.dispatchEvent(
      vdsEvent('vds-hls-load', {
        detail: HlsConstructor
      })
    );
  }

  /**
   * Loads `hls.js` from the remote source given via `hlsLibrary` into the window namespace. This
   * is because `hls.js` in 2021 still doesn't provide a ESM export. This method will return
   * `undefined` if it fails to load the script. Listen to `HlsLoadErrorEvent` to be notified
   * of any failures.
   */
  protected async _loadHlsScript(): Promise<HlsConstructor | undefined> {
    if (!isString(this.hlsLibrary)) return undefined;

    /* c8 ignore start */
    if (__DEV__) {
      this._logger.infoGroup('Starting to load `hls.js`');
    }
    /* c8 ignore stop */

    try {
      await ScriptLoader.load(this.hlsLibrary);

      if (!isFunction(window.Hls)) {
        throw Error(
          '[vds]: Failed loading `hls.js`. Could not find a valid constructor at `window.Hls`.'
        );
      }

      /* c8 ignore start */
      if (__DEV__) {
        this._logger
          .infoGroup('Loaded `hls.js`')
          .appendWithLabel('URL', this.hlsLibrary)
          .appendWithLabel('Library', window.Hls)
          .end();
      }
      /* c8 ignore stop */

      return window.Hls;
    } catch (err) {
      /* c8 ignore start */
      if (__DEV__) {
        this._logger
          .warnGroup('Failed to load `hls.js`')
          .appendWithLabel('URL', this.hlsLibrary)
          .end();
      }
      /* c8 ignore stop */

      this.dispatchEvent(
        vdsEvent('vds-hls-load-error', {
          detail: err as Error
        })
      );
    }

    return undefined;
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

    /* c8 ignore start */
    if (__DEV__) {
      this._logger.info('🏗️ Building HLS engine');
    }
    /* c8 ignore stop */

    // Destroy old engine.
    if (!isUndefined(this.hlsEngine)) {
      this._destroyHlsEngine();
    }

    if (isString(this.hlsLibrary)) {
      await this._loadHlsLibrary();
    }

    // Either a remote source and we cached the `hls.js` constructor, or it was bundled directly.
    // The previous `loadHlsLibrary()` called would've populated the cache if it was remote.
    this._Hls = isString(this.hlsLibrary)
      ? HLS_LIB_CACHE.get(this.hlsLibrary)
      : this.hlsLibrary;

    if (!this.Hls?.isSupported()) {
      /* c8 ignore start */
      if (__DEV__) {
        this._logger.warn('`hls.js` is not supported in this environment');
      }
      /* c8 ignore stop */

      this.dispatchEvent(vdsEvent('vds-hls-no-support'));
      return;
    }

    this._hlsEngine = new this.Hls(this.hlsConfig ?? {});

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup('🏗️ HLS engine built')
        .appendWithLabel('HLS Engine', this._hlsEngine)
        .appendWithLabel('Video Engine', this.videoEngine)
        .end();
    }
    /* c8 ignore stop */

    this.dispatchEvent(vdsEvent('vds-hls-build', { detail: this.hlsEngine }));
    this._listenToHlsEngine();
  }

  protected _destroyHlsEngine(): void {
    this.hlsEngine?.destroy();
    this._prevHlsEngineSrc = '';
    this._hlsEngine = undefined;
    this._isHlsEngineAttached = false;

    /* c8 ignore start */
    if (__DEV__) {
      this._logger.info('🏗️ Destroyed HLS engine');
    }
    /* c8 ignore stop */
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

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup('🏗️ attached HLS engine')
        .appendWithLabel('HLS Engine', this._hlsEngine)
        .appendWithLabel('Video Engine', this.videoEngine)
        .end();
    }
    /* c8 ignore stop */

    this.dispatchEvent(vdsEvent('vds-hls-attach', { detail: this.hlsEngine }));
  }

  protected _detachHlsEngine(): void {
    if (!this.isHlsEngineAttached) return;
    this.hlsEngine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsEngineSrc = '';

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup('🏗️ detached HLS engine')
        .appendWithLabel('Video Engine', this.videoEngine)
        .end();
    }
    /* c8 ignore stop */

    this.dispatchEvent(vdsEvent('vds-hls-detach', { detail: this.hlsEngine }));
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

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup(`📼 loading src \`${this.src}\``)
        .appendWithLabel('Src', this.src)
        .appendWithLabel('HLS Engine', this._hlsEngine)
        .appendWithLabel('Video Engine', this.videoEngine)
        .end();
    }
    /* c8 ignore stop */

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
    super._handleMediaSrcChange();

    // We don't want to load `hls.js` until the browser has had a chance to paint.
    if (!this.hasUpdated) return;

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

    /* c8 ignore start */
    if (__DEV__) {
      this._logger.debug(`📼 detected src change \`${this.src}\``);
    }
    /* c8 ignore stop */

    this._attachHlsEngine();
    this._loadSrcOnHlsEngine();
  }

  protected _listenToHlsEngine(): void {
    if (isUndefined(this.hlsEngine) || isUndefined(this.Hls)) return;

    // TODO: Bind all events.

    this.hlsEngine.on(
      this.Hls.Events.LEVEL_LOADED,
      this._handleHlsLevelLoaded.bind(this)
    );

    this.hlsEngine.on(this.Hls.Events.ERROR, this._handleHlsError.bind(this));
  }

  protected _handleHlsError(eventType: string, data: Hls.errorData): void {
    if (isUndefined(this.Hls)) return;

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .errorGroup(`HLS error \`${eventType}\``)
        .appendWithLabel('Event type', eventType)
        .appendWithLabel('Data', data)
        .appendWithLabel('Src', this.src)
        .appendWithLabel('Context', this.mediaState)
        .appendWithLabel('HLS Engine', this._hlsEngine)
        .appendWithLabel('Video Engine', this.videoEngine)
        .end();
    }
    /* c8 ignore stop */

    if (data.fatal) {
      switch (data.type) {
        case this.Hls.ErrorTypes.NETWORK_ERROR:
          this._handleHlsNetworkError(eventType, data);
          break;
        case this.Hls.ErrorTypes.MEDIA_ERROR:
          this._handleHlsMediaError(eventType, data);
          break;
        default:
          this._handleHlsIrrecoverableError(eventType, data);
          break;
      }
    }

    this.dispatchEvent(
      vdsEvent('vds-error', {
        originalEvent: new VdsEvent(eventType, { detail: data })
      })
    );
  }

  protected _handleHlsNetworkError(
    eventType: string,
    data: Hls.errorData
  ): void {
    this.hlsEngine?.startLoad();
  }

  protected _handleHlsMediaError(eventType: string, data: Hls.errorData): void {
    this.hlsEngine?.recoverMediaError();
  }

  protected _handleHlsIrrecoverableError(
    eventType: string,
    data: Hls.errorData
  ): void {
    this._destroyHlsEngine();
  }

  protected _handleHlsLevelLoaded(
    eventType: string,
    data: Hls.levelLoadedData
  ): void {
    if (this.canPlay) return;
    this._handleHlsMediaReady(eventType, data);
  }

  protected override _mediaReadyOnMetadataLoad = true;
  protected _handleHlsMediaReady(
    eventType: string,
    data: Hls.levelLoadedData
  ): void {
    const { live, totalduration: duration } = data.details;

    const event = new VdsEvent(eventType, { detail: data });

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.mediaState.mediaType !== mediaType) {
      this.dispatchEvent(
        vdsEvent('vds-media-type-change', {
          detail: mediaType,
          originalEvent: event
        })
      );
    }

    if (this.duration !== duration) {
      this.dispatchEvent(
        vdsEvent('vds-duration-change', {
          detail: duration,
          originalEvent: event
        })
      );
    }
  }
}
