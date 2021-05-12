import Hls from 'hls.js';
import { property, PropertyValues } from 'lit-element';

import {
  CanPlay,
  MediaType,
  VdsDurationChangeEvent,
  VdsErrorEvent,
  VdsMediaTypeChangeEvent,
} from '../../core';
import { VdsCustomEvent } from '../../shared/events';
import { isNil, isUndefined, noop } from '../../utils/unit';
import { VideoElement, VideoElementEngine } from '../video';
import {
  VdsHlsEngineAttachEvent,
  VdsHlsEngineBuiltEvent,
  VdsHlsEngineDetachEvent,
  VdsHlsEngineNoSupportEvent,
} from './hls.events';
import { HlsElementEngine, HlsElementProps } from './hls.types';
import { HLS_EXTENSIONS, HLS_TYPES } from './hls.utils';

/**
 * Enables loading, playing and controlling videos via the HTML5 `<video>` element. This provider
 * also introduces support for the [HTTP Live Streaming protocol](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
 * (also known as HLS) via the [`video-dev/hls.js`](https://github.com/video-dev/hls.js) library.
 *
 * You'll need to install `hls.js` to use this provider...
 *
 * ```bash
 * $: npm install hls.js@^0.14.0
 * ```
 *
 * @tagname vds-hls
 *
 * @slot Used to pass in `<source>`/`<track>` elements to the underlying HTML5 media player.
 * @slot ui - Used to pass in `<vds-ui>` to customize the player user interface.
 *
 * @csspart root - The component's root element that wraps the video (`<div>`).
 * @csspart video - The video element (`<video>`).
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
 *  <vds-hls src="/media/index.m3u8" poster="/media/poster.png">
 *    <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" label="English" />
 *    <vds-ui slot="ui">
 *      <!-- ... -->
 *    </vds-ui>
 *  </vds-hls>
 * ```
 */
export class HlsElement
  extends VideoElement<HlsElementEngine>
  implements HlsElementProps {
  protected _hlsEngine?: HlsElementEngine;

  protected _isHlsEngineAttached = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.handleMediaSrcChange();
  }

  async firstUpdated(changedProps: PropertyValues): Promise<void> {
    super.firstUpdated(changedProps);
    this.handleMediaSrcChange();
  }

  disconnectedCallback(): void {
    this.destroyHlsEngine();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property({ attribute: 'hls-config', type: Object })
  hlsConfig?: Partial<Hls.Config>;

  /**
   * The `hls.js` instance.
   */
  get engine(): HlsElementEngine {
    return this._hlsEngine;
  }

  get videoEngine(): VideoElementEngine {
    return this.mediaEl;
  }

  get isHlsEngineAttached(): boolean {
    return this._isHlsEngineAttached;
  }

  get currentSrc(): string {
    return this.isCurrentlyHls && !this.shouldUseNativeHlsSupport
      ? this.src
      : this.videoEngine?.currentSrc ?? '';
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): CanPlay {
    if (HLS_TYPES.has(type)) {
      return Hls.isSupported() ? CanPlay.Probably : CanPlay.Maybe;
    }

    return super.canPlayType(type);
  }

  get isCurrentlyHls(): boolean {
    return HLS_EXTENSIONS.test(this.src);
  }

  get hasNativeHlsSupport(): boolean {
    /**
     * We need to call this directly on `HTMLMediaElement`, calling `this.shouldPlayType(...)`
     * won't work here because it'll use the `CanPlayType` result from this provider override
     * which will incorrectly indicate that HLS can natively played due to `hls.js` support.
     */
    const canPlayType = super.canPlayType('application/vnd.apple.mpegurl');
    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  get shouldUseNativeHlsSupport(): boolean {
    if (Hls.isSupported()) return false;
    return this.hasNativeHlsSupport;
  }

  protected shouldSetVideoSrcAttr(): boolean {
    return this.shouldUseNativeHlsSupport || !this.isCurrentlyHls;
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
      this.shouldUseNativeHlsSupport ||
      this.src === this._prevHlsSrc
    )
      return;

    this.engine.loadSource(this.src);
    this._prevHlsSrc = this.src;
  }

  protected buildHlsEngine(): void {
    if (isNil(this.videoEngine) || !isUndefined(this.engine)) return;

    if (!Hls.isSupported()) {
      this.dispatchEvent(new VdsHlsEngineNoSupportEvent());
      return;
    }

    this._hlsEngine = new Hls(this.hlsConfig ?? {});
    this.dispatchEvent(new VdsHlsEngineBuiltEvent({ detail: this.engine }));
    this.listenToHlsEngine();
  }

  // Let `Html5MediaElement` know we're taking over ready events.
  protected willAnotherEngineAttach(): boolean {
    return this.isCurrentlyHls && !this.shouldUseNativeHlsSupport;
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

  protected handleMediaSrcChange(): void {
    super.handleMediaSrcChange();

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
        this.buildHlsEngine();
      }

      this.attachHlsEngine();
      this.loadSrcOnHlsEngine();
    });
  }

  protected listenToHlsEngine(): void {
    if (isUndefined(this.engine)) return;
    this.engine.on(
      Hls.Events.LEVEL_LOADED,
      this.handleHlsLevelLoaded.bind(this),
    );
    this.engine.on(Hls.Events.ERROR, this.handleHlsError.bind(this));
  }

  protected handleHlsError(eventType: string, data: Hls.errorData): void {
    this.context.error = data;

    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          this.handleHlsNetworkError(eventType, data);
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this.handleHlsMediaError(eventType, data);
          break;
        default:
          this.handleHlsIrrecoverableError(eventType, data);
          break;
      }
    }

    this.dispatchEvent(
      new VdsErrorEvent({
        originalEvent: new VdsCustomEvent(eventType, { detail: data }),
      }),
    );
  }

  protected handleHlsNetworkError(
    eventType: string,
    data: Hls.errorData,
  ): void {
    noop(eventType, data);
    this.engine?.startLoad();
  }

  protected handleHlsMediaError(eventType: string, data: Hls.errorData): void {
    noop(eventType, data);
    this.engine?.recoverMediaError();
  }

  protected handleHlsIrrecoverableError(
    eventType: string,
    data: Hls.errorData,
  ): void {
    noop(eventType, data);
    this.destroyHlsEngine();
  }

  protected handleHlsLevelLoaded(
    eventType: string,
    data: Hls.levelLoadedData,
  ): void {
    if (this.context.canPlay) return;
    this.handleHlsMediaReady(eventType, data);
  }

  protected handleHlsMediaReady(
    eventType: string,
    data: Hls.levelLoadedData,
  ): void {
    const { live, totalduration: duration } = data.details;

    const originalEvent = new VdsCustomEvent(eventType, { detail: data });

    const mediaType = live ? MediaType.LiveVideo : MediaType.Video;
    if (this.context.mediaType !== mediaType) {
      this.context.mediaType = mediaType;
      this.dispatchEvent(
        new VdsMediaTypeChangeEvent({ detail: mediaType, originalEvent }),
      );
    }

    if (this.context.duration !== duration) {
      this.context.duration = duration;
      this.dispatchEvent(
        new VdsDurationChangeEvent({ detail: duration, originalEvent }),
      );
    }

    this.handleMediaReady(originalEvent);
  }
}
