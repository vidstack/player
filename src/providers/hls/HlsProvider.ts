import { event, listen } from '@wcom/events';
import type Hls from 'hls.js';
import { property, PropertyValues } from 'lit-element';

import {
  DurationChangeEvent,
  ErrorEvent,
  MediaType,
  PlaybackReadyEvent,
  SrcChangeEvent,
} from '../../core';
import { LibLoader } from '../../shared/LibLoader';
import { isNil, isUndefined } from '../../utils/unit';
import { VideoProvider, VideoProviderEngine } from '../video';
import {
  HlsEngineAttachEvent,
  HlsEngineBuiltEvent,
  HlsEngineDetachEvent,
  HlsEngineNoSuppotEvent,
  HlsEvents,
} from './hls.events';
import { HlsProviderEngine } from './hls.types';
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
 * @csspart root - The root component element that wraps the video (`<div>`).
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
export class HlsProvider extends VideoProvider<HlsProviderEngine> {
  protected _hlsEngine?: HlsProviderEngine;

  protected HlsLib?: typeof Hls;

  protected libLoader: LibLoader<typeof Hls>;

  protected _isHlsEngineAttached = false;

  constructor() {
    super();
    this.libLoader = new LibLoader(this.libSrc, 'Hls');
  }

  connectedCallback(): void {
    super.connectedCallback();
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

  get isPlaybackReady(): boolean {
    return this.isCurrentlyHls && !this.hasNativeHlsSupport
      ? this._isPlaybackReady
      : this.isMediaElReadyForPlayback();
  }

  get currentSrc(): string {
    return this.isCurrentlyHls && !this.hasNativeHlsSupport
      ? this.src
      : this.videoEngine?.currentSrc ?? '';
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): boolean {
    return HLS_TYPES.has(type) || super.canPlayType(type);
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
    return super.canPlayType('application/vnd.apple.mpegurl') ?? false;
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
    this._isPlaybackReady = false;
  }

  protected _prevHlsSrc = '';

  protected loadSrcOnHlsEngine(): void {
    if (
      !this.isCurrentlyHls ||
      this.hasNativeHlsSupport ||
      this.src === this._prevHlsSrc
    )
      return;

    this.engine?.loadSource(this.src);
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
      this.dispatchEvent(new HlsEngineNoSuppotEvent());
      return;
    }

    this._hlsEngine = new this.HlsLib(this.hlsConfig ?? {});
    this.dispatchEvent(new HlsEngineBuiltEvent({ detail: this.engine }));
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
    this.dispatchEvent(new HlsEngineAttachEvent({ detail: this.engine }));
  }

  protected detachHlsEngine(): void {
    if (!this.isHlsEngineAttached) return;
    this.engine?.detachMedia();
    this._isHlsEngineAttached = false;
    this._prevHlsSrc = '';
    this.dispatchEvent(new HlsEngineDetachEvent({ detail: this.engine }));
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

  @listen(SrcChangeEvent.TYPE)
  protected handleSrcChange(): void {
    this._isPlaybackReady = false;

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
      this.handleHlsLevelLoaded.bind(this),
    );
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

    this.dispatchEvent(new ErrorEvent({ detail: data, originalEvent }));
  }

  protected _isPlaybackReady = false;

  protected handleHlsLevelLoaded(
    originalEvent: string,
    data: Hls.levelLoadedData,
  ): void {
    if (this._isPlaybackReady) return;

    this.dispatchEvent(
      new DurationChangeEvent({
        detail: data.details.totalduration,
        originalEvent,
      }),
    );

    this._isPlaybackReady = true;
    this.dispatchEvent(new PlaybackReadyEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely documentation purposes only, it'll be picked up by `@wcom/cli`.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when the `hls.js` instance is built. This will not fire if the browser natively
   * supports HLS.
   */
  @event({ name: 'vds-hls-engine-built' })
  protected engineBuiltEvent!: HlsEvents['vds-hls-engine-built'];

  /**
   * Emitted when the `hls.js` instance has attached itself to the media element. This will not
   * fire if the browser natively supports HLS.
   */
  @event({ name: 'vds-hls-engine-attach' })
  protected engineAttachEvent!: HlsEvents['vds-hls-engine-attach'];

  /**
   * Emitted when the `hls.js` instance has detached itself from the media element.
   */
  @event({ name: 'vds-hls-engine-detach' })
  protected engineDetachEvent!: HlsEvents['vds-hls-engine-detach'];

  /**
   * Emitted when the browser doesn't support HLS natively and `hls.js` doesn't support
   * this enviroment either, most likely due to missing Media Extensions.
   */
  @event({ name: 'vds-hls-engine-no-support' })
  protected engineNoSupportEvent!: HlsEvents['vds-hls-engine-no-support'];
}
