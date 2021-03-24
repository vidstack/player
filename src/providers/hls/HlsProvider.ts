import type Hls from 'hls.js';
import { property, PropertyValues } from 'lit-element';

import {
  CanPlay,
  MediaType,
  VdsDurationChangeEvent,
  VdsErrorEvent,
} from '../../core';
import { LibLoader } from '../../shared/LibLoader';
import { isNil, isUndefined } from '../../utils/unit';
import { VideoProvider, VideoProviderEngine } from '../video';
import {
  VdsHlsEngineAttachEvent,
  VdsHlsEngineBuiltEvent,
  VdsHlsEngineDetachEvent,
  VdsHlsEngineNoSuppotEvent,
} from './hls.events';
import { HlsProviderEngine, HlsProviderProps } from './hls.types';
import { HLS_EXTENSIONS, HLS_TYPES } from './hls.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS).
 *
 * This provider will load the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library
 * if the browser doesn't have native HLS support.
 *
 * ## Tag
 *
 * @tagname vds-hls
 *
 * ## Slots
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *   <!-- ... -->
 * </vds-hls>
 * ```
 *
 * @example
 * ```html
 *  <vds-hls poster="/media/poster.png">
 *    <source src="/media/index.m3u8" type="application/x-mpegURL" />
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-hls>
 * ```
 */
export class HlsProvider
  extends VideoProvider<HlsProviderEngine>
  implements HlsProviderProps {
  protected _hlsEngine?: HlsProviderEngine;

  protected HlsLib?: typeof Hls;

  protected libLoader!: LibLoader<typeof Hls>;

  protected _isHlsEngineAttached = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.libLoader = new LibLoader(this.libSrc, 'Hls');
    this.handleSrcChange();
  }

  async firstUpdated(changedProps: PropertyValues): Promise<void> {
    super.firstUpdated(changedProps);
    this.handleSrcChange();
  }

  disconnectedCallback(): void {
    this.destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The URL where the `hls.js` library source can be found.
   */
  @property({ attribute: 'lib-src' })
  libSrc = 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.min.js';

  /**
   * The `hls.js` configuration object.
   */
  @property({ attribute: 'hls-config', type: Object })
  hlsConfig?: Hls.Config;

  /**
   * The `hls.js` instance.
   */
  get engine(): HlsProviderEngine {
    return this._hlsEngine;
  }

  /**
   * The underlying `HTMLMediaElement`.
   */
  get videoEngine(): VideoProviderEngine {
    return this.mediaEl;
  }

  /**
   * Whether the `hls.js` instance has mounted the `HtmlMediaElement`.
   */
  get isHlsEngineAttached(): boolean {
    return this._isHlsEngineAttached;
  }

  get currentSrc(): string {
    return this.isCurrentlyHls && !this.hasNativeHlsSupport
      ? this.src
      : this.videoEngine?.currentSrc ?? '';
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): CanPlay {
    if (HLS_TYPES.has(type)) {
      return this.HlsLib?.isSupported() ? CanPlay.Probably : CanPlay.Maybe;
    }

    return super.canPlayType(type);
  }

  /**
   * Whether the current src is using HLS.
   */
  get isCurrentlyHls(): boolean {
    return HLS_EXTENSIONS.test(this.src);
  }

  /**
   * Whether the browser natively supports HLS, mostly only true in Safari. Only call this method
   * after the provider has connected to the DOM (wait for `ConnectEvent`).
   */
  get hasNativeHlsSupport(): boolean {
    /**
     * We need to call this directly on `HTMLMediaElement`, calling `this.shouldPlayType(...)`
     * won't work here because it'll use the `CanPlayType` result from this provider override
     * which will incorrectly indicate that HLS can natively played due to `hls.js` support.
     */
    const canPlayType = super.canPlayType('application/vnd.apple.mpegurl');
    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  protected shouldSetVideoSrcAttr(): boolean {
    return this.hasNativeHlsSupport || !this.isCurrentlyHls;
  }

  protected isHlsEngineInitializing = false;

  protected async initHlsEngine(): Promise<void> {
    if (
      isNil(this.videoEngine) ||
      this.hasNativeHlsSupport ||
      this.isHlsEngineInitializing ||
      !this.isCurrentlyHls
    )
      return;

    this.isHlsEngineInitializing = true;

    this.libLoader.src = this.libSrc;
    this.HlsLib = await this.libLoader.download();

    if (this.HlsLib.isSupported()) {
      this.buildHlsEngine();
      this.attachHlsEngine();
      this.loadSrcOnHlsEngine();
    }

    this.isHlsEngineInitializing = false;
  }

  protected destroyHlsEngine(): void {
    this.engine?.destroy();
    this._prevHlsSrc = '';
    this._isHlsEngineAttached = false;
    this.context.canPlay = false;
  }

  protected _prevHlsSrc = '';

  protected loadSrcOnHlsEngine(): void {
    if (
      isNil(this.engine) ||
      !this.isCurrentlyHls ||
      this.hasNativeHlsSupport ||
      this.src === this._prevHlsSrc
    )
      return;

    this.engine.loadSource(this.src);
    this._prevHlsSrc = this.src;
  }

  protected buildHlsEngine(): void {
    if (isNil(this.videoEngine)) return;

    if (!isUndefined(this.engine)) {
      this.attachHlsEngine();
      this.loadSrcOnHlsEngine();
      return;
    }

    if (!this.HlsLib?.isSupported()) {
      this.dispatchEvent(new VdsHlsEngineNoSuppotEvent());
      return;
    }

    this._hlsEngine = new this.HlsLib(this.hlsConfig ?? {});
    this.dispatchEvent(new VdsHlsEngineBuiltEvent({ detail: this.engine }));
    this.listenToHlsEngine();
  }

  // Let `MediaFileProvider` know we're taking over ready events.
  protected willAnotherEngineAttach(): boolean {
    return !this.hasNativeHlsSupport && (this.HlsLib?.isSupported() ?? false);
  }

  protected attachHlsEngine(): void {
    if (
      this.isHlsEngineAttached ||
      isUndefined(this.engine) ||
      isNil(this.videoEngine)
    )
      return;

    this.engine.attachMedia(this.videoEngine);
    this._isHlsEngineAttached = true;
    this.dispatchEvent(new VdsHlsEngineAttachEvent({ detail: this.engine }));
  }

  protected detachHlsEngine(): void {
    if (!this.isHlsEngineAttached) return;
    this.engine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsSrc = '';
    this.dispatchEvent(new VdsHlsEngineDetachEvent({ detail: this.engine }));
  }

  protected getMediaType(): MediaType {
    if (this.isCurrentlyHls) {
      return MediaType.Video;
    }

    return super.getMediaType();
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected handleSrcChange(): void {
    this.context.canPlay = false;

    if (!this.isCurrentlyHls) {
      this.detachHlsEngine();
      return;
    }

    // Need to wait for `src` attribute on `<video>` to clear if last `src` was not using
    // HLS engine.
    window.requestAnimationFrame(async () => {
      await this.requestUpdate();

      if (isUndefined(this.engine)) {
        this.initHlsEngine();
      } else {
        this.attachHlsEngine();
        this.loadSrcOnHlsEngine();
      }
    });
  }

  protected listenToHlsEngine(): void {
    if (isUndefined(this.engine) || isUndefined(this.HlsLib)) return;

    this.engine.on(
      this.HlsLib.Events.LEVEL_LOADED,
      this.handleHlsMediaReady.bind(this),
    );

    this.engine.on(this.HlsLib.Events.ERROR, this.handleHlsError.bind(this));
  }

  protected handleHlsError(originalEvent: string, data: Hls.errorData): void {
    if (data.fatal) {
      switch (data.type) {
        case this.HlsLib?.ErrorTypes.NETWORK_ERROR:
          this.engine?.startLoad();
          break;
        case this.HlsLib?.ErrorTypes.MEDIA_ERROR:
          this.engine?.recoverMediaError();
          break;
        default:
          this.destroyHlsEngine();
          break;
      }
    }

    this.context.error = data;
    this.dispatchEvent(new VdsErrorEvent({ detail: data, originalEvent }));
  }

  protected handleHlsMediaReady(
    originalEvent: string,
    data: Hls.levelLoadedData,
  ): void {
    if (this.context.canPlay) return;

    const duration = data.details.totalduration;
    this.context.duration = duration;
    this.dispatchEvent(
      new VdsDurationChangeEvent({
        detail: duration,
        originalEvent,
      }),
    );

    this.mediaReady();
  }
}
