import {
  isHlsjsSupported,
  isNil,
  isString,
  isUndefined,
  preconnect,
  VdsEvent,
  vdsEvent,
} from '@vidstack/foundation';
import type Hls from 'hls.js';
import type { ErrorData, Events as HlsEvent, HlsConfig, LevelLoadedData } from 'hls.js';
import { type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { MediaErrorCode, MediaType } from '../../media';
import { VideoElement } from '../video';
import type { DynamicHlsConstructorImport, HlsConstructor } from './types';
import {
  type HlsConstructorLoadCallbacks,
  importHlsConstructor,
  isHlsConstructorCached,
  isHlsEventType,
  loadHlsConstructorScript,
  vdsToHlsEventType,
} from './utils';

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

// Taken from video.js
export const HLS_TYPES = new Set([
  // Apple sanctioned
  'application/vnd.apple.mpegurl',
  // Apple sanctioned for backwards compatibility
  'audio/mpegurl',
  // Very common
  'audio/x-mpegurl',
  // Very common
  'application/x-mpegurl',
  // Included for completeness
  'video/x-mpegurl',
  'video/mpegurl',
  'application/mpegurl',
]);

const HLS_CDN_SRC_BASE = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light';
const HLS_CDN_SRC_DEV = `${HLS_CDN_SRC_BASE}.js` as const;
const HLS_CDN_SRC_PROD = `${HLS_CDN_SRC_BASE}.min.js` as const;

/**
 * The `<vds-hls>` element adapts the underlying `<video>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * This element also introduces support for HLS streaming via the popular `hls.js` library.
 * HLS streaming is either [supported natively](https://caniuse.com/?search=hls) (generally
 * on iOS), or in environments that [support the Media Stream API](https://caniuse.com/?search=mediastream).
 *
 * 💡 This element re-dispatches all `hls.js` events so you can listen for them through the
 * native DOM interface (i.e., `vds-hls-media-attaching`).
 *
 * @tagname vds-hls
 * @slot - Used to pass in the `<video>` element.
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 * @link https://github.com/video-dev/hls.js/blob/master/docs/API.md
 * @events ./events.ts
 * @example
 * ```html
 * <vds-hls
 *  preload="metadata"
 *  poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <video
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/hls/index.m3u8"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   ></video>
 * </vds-hls>
 * ```
 * @example
 * ```html
 * <vds-hls
 *   loading="lazy"
 *   preload="metadata"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <video
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/hls/index.m3u8"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   ></video>
 * </vds-hls>
 * ```
 * @example
 * ```html
 * <vds-hls
 *   preload="metadata"
 *   poster="https://media-files.vidstack.io/poster.png"
 * >
 *   <video
 *     controls
 *     preload="none"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   >
 *     <source
 *       src="https://media-files.vidstack.io/hls/index.m3u8"
 *       type="application/x-mpegURL"
 *     />
 *     <track
 *       default
 *       kind="subtitles"
 *       srclang="en"
 *       label="English"
 *       src="https://media-files.vidstack.io/subs/english.vtt"
 *     />
 *   </video>
 * </vds-hls>
 * ```
 */
export class HlsElement extends VideoElement {
  protected _hlsEngine: Hls | undefined;
  protected _isHlsEngineAttached = false;

  constructor() {
    super();

    // See https://github.com/vidstack/player/issues/583
    Object.defineProperty(this, 'hls-config', {
      set: (config) => {
        this.hlsConfig = config;
      },
    });
    Object.defineProperty(this, 'hls-library', {
      set: (lib) => {
        this.hlsLibrary = lib;
      },
    });
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The `hls.js` configuration object.
   *
   * @link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
   */
  @property({ type: Object, attribute: 'hls-config' })
  hlsConfig: Partial<HlsConfig | undefined> = {};

  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @default DEV: 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.js'
   * @default PROD: 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js'
   */
  @property({ attribute: 'hls-library' })
  hlsLibrary: HlsConstructor | DynamicHlsConstructorImport | string | undefined = __DEV__
    ? HLS_CDN_SRC_DEV
    : HLS_CDN_SRC_PROD;

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

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override async update(changedProperties: PropertyValues) {
    super.update(changedProperties);

    if (changedProperties.has('hlsLibrary') && isHlsjsSupported()) {
      this._preconnectToHlsLibDownload();
    }
  }

  override disconnectedCallback() {
    this._destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  /**
   * Whether HLS streaming is supported in this environment.
   */
  get isHlsSupported(): boolean {
    return this.Hls?.isSupported() ?? isHlsjsSupported();
  }

  /**
   * Whether the current src is using HLS.
   *
   * @default false
   */
  get isHlsStream(): boolean {
    return this.state.src.length === 1 && HLS_EXTENSIONS.test(this.state.src[0]);
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
    if (this.canLoad || !isString(this.hlsLibrary) || isHlsConstructorCached(this.hlsLibrary)) {
      return;
    }

    if (__DEV__) {
      this._logger
        ?.infoGroup('Preconnect to `hls.js` download')
        .labelledLog('URL', this.hlsLibrary)
        .dispatch();
    }

    preconnect(this.hlsLibrary);
  }

  protected async _buildHlsEngine(forceRebuild = false): Promise<void> {
    // Need to mount on `<video>`.
    if (isNil(this.videoElement) && !forceRebuild && !isUndefined(this.hlsEngine)) {
      this._logger
        ?.infoGroup('🏗️ Could not build HLS engine')
        .labelledLog('Video Element', this.videoElement)
        .labelledLog('HLS Engine', this.hlsEngine)
        .labelledLog('Force Rebuild Flag', forceRebuild)
        .dispatch();
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

        this.dispatchEvent(vdsEvent('vds-hls-lib-loaded', { detail: HlsConstructor }));
      },
      onLoadError: (err) => {
        if (__DEV__) {
          this._logger
            ?.errorGroup('Failed to load `hls.js`')
            .labelledLog('Lib Loader', this.hlsLibrary)
            .labelledLog('Error', err)
            .dispatch();
        }

        this.dispatchEvent(vdsEvent('vds-hls-lib-load-error', { detail: err as Error }));

        this.dispatchEvent(
          vdsEvent('vds-error', {
            detail: {
              message: err.message,
              code: MediaErrorCode.SrcNotSupported,
            },
          }),
        );
      },
    };

    // If not a string it'll return undefined.
    this._Hls = await loadHlsConstructorScript(this.hlsLibrary, callbacks);

    // If it's not a remote source, it must of been passed in directly as a static/dynamic import.
    if (isUndefined(this._Hls) && !isString(this.hlsLibrary)) {
      this._Hls = await importHlsConstructor(this.hlsLibrary, callbacks);
    }

    if (!this.Hls) {
      return;
    }

    if (!this.Hls?.isSupported?.()) {
      const message = '[vds]: `hls.js` is not supported in this environment';

      if (__DEV__) {
        this._logger?.error(message);
      }

      this.dispatchEvent(vdsEvent('vds-hls-unsupported'));

      this.dispatchEvent(
        vdsEvent('vds-error', {
          detail: {
            message,
            code: MediaErrorCode.SrcNotSupported,
          },
        }),
      );

      return;
    }

    this._hlsEngine = new this.Hls(this.hlsConfig);

    if (__DEV__) {
      this._logger
        ?.infoGroup('🏗️ HLS engine built')
        .labelledLog('Video Element', this.videoElement)
        .labelledLog('HLS Engine', this.hlsEngine)
        .dispatch();
    }

    this.dispatchEvent(vdsEvent('vds-hls-instance', { detail: this.hlsEngine }));

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

  protected _attachHlsEngine(): void {
    if (this.isHlsEngineAttached || isUndefined(this.hlsEngine) || isNil(this.videoElement)) {
      return;
    }

    this.hlsEngine.attachMedia(this.videoElement);
    this._isHlsEngineAttached = true;

    if (__DEV__) {
      this._logger
        ?.infoGroup('🏗️ Attached HLS engine')
        .labelledLog('Video Element', this.videoElement)
        .labelledLog('HLS Engine', this._hlsEngine)
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
        ?.infoGroup('🏗️ Detached HLS engine')
        .labelledLog('Video Element', this.videoElement)
        .dispatch();
    }
  }

  protected _loadSrcOnHlsEngine(src: string): void {
    if (isNil(this.hlsEngine) || !this.isHlsStream || src === this._prevHlsEngineSrc) {
      return;
    }

    if (__DEV__) {
      this._logger
        ?.infoGroup(`📼 Loading Source`)
        .labelledLog('Src', src)
        .labelledLog('Video Element', this.videoElement)
        .labelledLog('HLS Engine', this._hlsEngine)
        .dispatch();
    }

    this.hlsEngine.loadSource(src);
    this._prevHlsEngineSrc = src;
  }

  protected override _getMediaType(): MediaType {
    if (this.state.mediaType === MediaType.LiveVideo) {
      return MediaType.LiveVideo;
    }

    if (this.isHlsStream) {
      return MediaType.Video;
    }

    return super._getMediaType();
  }

  // -------------------------------------------------------------------------------------------
  // Src Changes
  // -------------------------------------------------------------------------------------------

  protected override _handleAbort(event?: Event): void {
    if (this.isHlsSupported) {
      for (const src of this.state.src) {
        if (HLS_EXTENSIONS.test(src)) {
          this._handleHlsSrcChange(src);
          return;
        }
      }
    }

    super._handleAbort(event);
  }

  protected async _handleHlsSrcChange(src: string) {
    if (this._prevHlsEngineSrc === src) return;

    // We don't want to load `hls.js` until the browser has had a chance to paint.
    if (!this.hasUpdated || !this.canLoad) return;

    if (!this.isHlsStream) {
      this._detachHlsEngine();
      return;
    }

    if (isNil(this.hlsLibrary)) return;

    if (isUndefined(this.hlsEngine)) {
      await this._buildHlsEngine();
    }

    if (__DEV__) {
      this._logger?.debug(`📼 Detected HLS source change \`${this.state.src}\``);
    }

    this._attachHlsEngine();
    this._loadSrcOnHlsEngine(src);
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected override _handleLoadedMetadata(event: Event): void {
    super._handleLoadedMetadata(event);
    this._handleMediaReady({
      event,
      duration: this.mediaElement!.duration,
    });
  }

  protected _listenToHlsEngine(): void {
    if (isUndefined(this.hlsEngine) || isUndefined(this.Hls)) return;

    this.hlsEngine.on(this.Hls.Events.LEVEL_LOADED, this._handleHlsLevelLoaded.bind(this));

    this._hlsEventListeners.forEach(({ type, listener, options }) => {
      this.hlsEngine?.[options?.once ? 'once' : 'on'](type, listener, options?.context);
    });

    this.hlsEngine.on(this.Hls.Events.ERROR, this._handleHlsError.bind(this));
  }

  protected _handleHlsError(eventType: string, data: ErrorData): void {
    if (isUndefined(this.Hls)) return;

    if (__DEV__) {
      this._logger
        ?.errorGroup(`HLS error \`${eventType}\``)
        .labelledLog('Video Element', this.videoElement)
        .labelledLog('HLS Engine', this._hlsEngine)
        .labelledLog('Event Type', eventType)
        .labelledLog('Data', data)
        .labelledLog('Src', this.state.src)
        .labelledLog('State', { ...this.state })
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

  protected _handleHlsLevelLoaded(eventType: string, data: LevelLoadedData): void {
    if (this.state.canPlay) return;
    this._handleHlsMediaReady(eventType, data);
  }

  protected _handleHlsMediaReady(eventType: string, data: LevelLoadedData): void {
    const { live, totalduration: duration } = data.details;

    const event = new VdsEvent(eventType, { detail: data });

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.state.mediaType !== mediaType) {
      this.dispatchEvent(
        vdsEvent('vds-media-type-change', {
          detail: mediaType,
          triggerEvent: event,
        }),
      );
    }

    if (this.state.duration !== duration) {
      this.dispatchEvent(
        vdsEvent('vds-duration-change', {
          detail: duration,
          triggerEvent: event,
        }),
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
    options?: boolean | (AddEventListenerOptions & { context: any }),
  ): void;

  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | (AddEventListenerOptions & { context: any }),
  ): void;

  override addEventListener(type: any, listener: any, options?: any): void {
    if (isHlsEventType(type)) {
      const hlsEventType = vdsToHlsEventType(type) as HlsEvent;

      const hasEventListener = this._hlsEventListeners.some(
        (l) => l.type === hlsEventType && l.listener === listener,
      );

      if (!hasEventListener) {
        this._hlsEventListeners.push({ type: hlsEventType, listener, options });
        this.hlsEngine?.[options?.once ? 'once' : 'on'](hlsEventType, listener, options?.context);
      }

      return;
    }

    return super.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;

  override removeEventListener(type: any, listener: any, options?: any): void {
    if (isHlsEventType(type)) {
      const hlsEventType = vdsToHlsEventType(type) as HlsEvent;
      this._hlsEventListeners = this._hlsEventListeners.filter(
        (l) => l.type === hlsEventType && l.listener === listener,
      );
      this.hlsEngine?.off(hlsEventType, listener, options?.context, options?.once);
      return;
    }

    return super.removeEventListener(type, listener, options);
  }
}
