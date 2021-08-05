import { html, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';

import { listen, redispatchEvent, vdsEvent } from '../../base/events';
import { DEV_MODE } from '../../env';
import { CanPlay, MediaProviderElement, MediaType } from '../../media';
import { getSlottedChildren } from '../../utils/dom';
import { keysOf } from '../../utils/object';
import { IS_SAFARI } from '../../utils/support';
import { isNil, isNumber, isUndefined } from '../../utils/unit';
import { MediaNetworkState } from './MediaNetworkState';
import { MediaReadyState } from './MediaReadyState';

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;

/**
 * A DOMString` indicating the `CORS` setting for this media element.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 */
export type MediaCrossOriginOption = 'anonymous' | 'use-credentials';

/**
 * Is a `DOMString` that reflects the `preload` HTML attribute, indicating what data should be
 * preloaded, if any.
 */
export type MediaPreloadOption = 'none' | 'metadata' | 'auto';

/**
 * `DOMTokenList` that helps the user agent select what controls to show on the media element
 * whenever the user agent shows its own set of controls. The `DOMTokenList` takes one or more of
 * three possible values: `nodownload`, `nofullscreen`, and `noremoteplayback`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
 */
export type MediaControlsList =
  | 'nodownload'
  | 'nofullscreen'
  | 'noremoteplayback'
  | 'nodownload nofullscreen'
  | 'nodownload noremoteplayback'
  | 'nofullscreen noremoteplayback'
  | 'nodownload nofullscreen noremoteplayback';

/**
 * The object which serves as the source of the media associated with the `HTMLMediaElement`. The
 * object can be a `MediaStream`, `MediaSource`, `Blob`, or `File` (which inherits from `Blob`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
 * @link https://developer.mozilla.org/en-US/docs/Web/API/MediaSource
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * @link https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export type MediaSrcObject = MediaStream | MediaSource | Blob | File;

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Html5MediaElement extends MediaProviderElement {
  static override get events(): (keyof GlobalEventHandlersEventMap)[] {
    const nativeMediaEvents = MediaProviderElement.events.map((event) =>
      // vds-can-play => canplay
      event.slice(4).replace('-', '')
    ) as (keyof GlobalEventHandlersEventMap)[];

    return [...nativeMediaEvents, ...super.events];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
   */
  @property()
  controlsList: MediaControlsList | undefined = undefined;

  /**
   * Whether to use CORS to fetch the related image. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
   * information.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin
   */
  @property()
  crossOrigin: MediaCrossOriginOption | undefined;

  /**
   * Reflects the muted attribute, which indicates whether the audio output should be muted by
   * default.  This property has no dynamic effect. To mute and unmute the audio output, use
   * the `muted` property.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultMuted
   */
  @property({ type: Boolean })
  defaultMuted: boolean | undefined;

  /**
   * A `double` indicating the default playback rate for the media.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/defaultPlaybackRate
   */
  @property({ type: Number })
  defaultPlaybackRate: number | undefined;

  /**
   *  Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
   * DLNA, AirPlay, etc).
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/disableRemotePlayback
   * @see https://www.w3.org/TR/remote-playback/#the-disableremoteplayback-attribute
   */
  @property({ type: Boolean })
  disableRemotePlayback: boolean | undefined;

  /**
   * Provides a hint to the browser about what the author thinks will lead to the best user
   * experience with regards to what content is loaded before the video is played. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
   * information.
   */
  @property()
  preload: MediaPreloadOption | undefined;

  /**
   * The width of the media player.
   */
  @property({ type: Number })
  width: number | undefined;

  /**
   * The height of the media player.
   */
  @property({ type: Number })
  height: number | undefined;

  @state()
  protected _src = '';

  /**
   * The URL of a media resource to use.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
   */
  @property()
  get src(): string {
    return this._src;
  }

  set src(newSrc) {
    if (this._src !== newSrc) {
      this._src = newSrc;
      this._handleMediaSrcChange();
    }
  }

  protected readonly _mediaRef = createRef<HTMLMediaElement>();

  get mediaElement() {
    return this._mediaRef.value;
  }

  /**
   * Sets or returns the object which serves as the source of the media associated with the
   * `HTMLMediaElement`.
   *
   * @default undefined
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
   */
  get srcObject(): MediaSrcObject | undefined {
    return this.mediaElement?.srcObject ?? undefined;
  }

  set srcObject(newSrcObject) {
    if (
      !isUndefined(this.mediaElement) &&
      this.mediaElement.srcObject !== newSrcObject
    ) {
      // TODO: this has to be attached after `firstUpdated`?
      this.mediaElement.srcObject = newSrcObject ?? null;
      this._handleMediaSrcChange();
    }
  }

  /**
   * Indicates the readiness state of the media.
   *
   * @default ReadyState.HaveNothing
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
   */
  get readyState() {
    return this.mediaElement?.readyState ?? MediaReadyState.HaveNothing;
  }

  /**
   * Indicates the current state of the fetching of media over the network.
   *
   * @default NetworkState.Empty
   */
  get networkState() {
    return this.mediaElement?.networkState ?? MediaNetworkState.Empty;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    this._bindMediaEventListeners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._cancelTimeUpdates();
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to modify the content rendered inside `<audio>` and `<video>` elements.
   */
  protected _renderMediaChildren(): TemplateResult {
    return html`
      <slot @slotchange="${this._handleDefaultSlotChange}"></slot>
      Your browser does not support the <code>audio</code> or
      <code>video</code> element.
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Time Updates
  // The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
  // bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
  // resolve that :)
  // -------------------------------------------------------------------------------------------

  protected _timeRAF = -1;

  protected _cancelTimeUpdates() {
    if (isNumber(this._timeRAF)) window.cancelAnimationFrame(this._timeRAF);
    this._timeRAF = -1;
  }

  protected _requestTimeUpdates() {
    const newTime = this.mediaElement?.currentTime ?? 0;

    if (this.ctx.currentTime !== newTime) {
      this.ctx.currentTime = newTime;
      this.dispatchEvent(vdsEvent('vds-time-update', { detail: newTime }));
    }

    this._timeRAF = window.requestAnimationFrame(() => {
      if (isUndefined(this._timeRAF)) return;
      this._requestTimeUpdates();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Slots
  // -------------------------------------------------------------------------------------------

  protected _handleDefaultSlotChange() {
    if (isNil(this.mediaElement)) return;
    this._cancelTimeUpdates();
    this._cleanupOldSourceNodes();
    this._attachNewSourceNodes();
  }

  protected _cleanupOldSourceNodes() {
    const nodes = this.mediaElement?.querySelectorAll('source,track');
    nodes?.forEach((node) => node.remove());
  }

  protected _attachNewSourceNodes() {
    const validTags = new Set(['source', 'track']);

    const nodes = getSlottedChildren(this).filter((node) =>
      validTags.has(node.tagName.toLowerCase())
    );

    if (DEV_MODE && nodes.length > 0) {
      this._logger
        .logGroup('Found `<source>` and `<track>` elements')
        .appendWithLabel('Nodes', nodes)
        .end();
    }

    nodes.forEach((node) => this.mediaElement?.appendChild(node.cloneNode()));

    window.requestAnimationFrame(() => {
      this._handleMediaSrcChange();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected _bindMediaEventListeners() {
    if (isNil(this.mediaElement)) return;

    const eventHandlers = {
      abort: this._handleAbort,
      canplay: this._handleCanPlay,
      canplaythrough: this._handleCanPlayThrough,
      durationchange: this._handleDurationChange,
      emptied: this._handleEmptied,
      ended: this._handleEnded,
      error: this._handleError,
      loadeddata: this._handleLoadedData,
      loadedmetadata: this._handleLoadedMetadata,
      loadstart: this._handleLoadStart,
      pause: this._handlePause,
      play: this._handlePlay,
      playing: this._handlePlaying,
      progress: this._handleProgress,
      ratechange: this._handleRateChange,
      seeked: this._handleSeeked,
      seeking: this._handleSeeking,
      stalled: this._handleStalled,
      suspend: this._handleSuspend,
      timeupdate: this._handleTimeUpdate,
      volumechange: this._handleVolumeChange,
      waiting: this._handleWaiting
    };

    keysOf(eventHandlers).forEach((type) => {
      const handler = eventHandlers[type].bind(this);
      this._disconnectDisposal.add(
        listen(this.mediaElement!, type, async (event: Event) => {
          if (DEV_MODE && type !== 'timeupdate') {
            this._logger
              .infoGroup(`📺 fired \`${event.type}\``)
              .appendWithLabel('Event', event)
              .appendWithLabel('Engine', this.engine)
              .appendWithLabel('Context', this.mediaState)
              .end();
          }

          await handler(event);

          // re-dispatch native event for spec-compliance.
          redispatchEvent(this, event);
        })
      );
    });

    if (DEV_MODE) {
      this._logger.debug('attached event listeners');
    }
  }

  protected _handleAbort(event: Event) {
    this.dispatchEvent(vdsEvent('vds-abort', { originalEvent: event }));
  }

  protected _handleCanPlay(event: Event) {
    if (this.ctx.canPlay) return;
    this.ctx.buffered = this.mediaElement!.buffered;
    this.ctx.seekable = this.mediaElement!.seekable;
    if (!this._willAnotherEngineAttach()) this._handleMediaReady(event);
  }

  protected _handleCanPlayThrough(event: Event) {
    if (this.ctx.canPlayThrough) return;
    this.ctx.canPlayThrough = true;
    this.dispatchEvent(
      vdsEvent('vds-can-play-through', { originalEvent: event })
    );
  }

  protected _handleLoadStart(event: Event) {
    this.ctx.currentSrc = this.mediaElement!.currentSrc;
    this.dispatchEvent(vdsEvent('vds-load-start', { originalEvent: event }));
  }

  protected _handleEmptied(event: Event) {
    this.dispatchEvent(vdsEvent('vds-emptied', { originalEvent: event }));
  }

  protected _handleLoadedData(event: Event) {
    this.dispatchEvent(vdsEvent('vds-loaded-data', { originalEvent: event }));
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   */
  protected _willAnotherEngineAttach(): boolean {
    return false;
  }

  protected _handleLoadedMetadata(event: Event) {
    this.ctx.duration = this.mediaElement!.duration;
    this.dispatchEvent(
      vdsEvent('vds-duration-change', {
        detail: this.ctx.duration,
        originalEvent: event
      })
    );
    this.dispatchEvent(
      vdsEvent('vds-loaded-metadata', { originalEvent: event })
    );
    this._determineMediaType(event);
  }

  protected _determineMediaType(event: Event) {
    this.ctx.mediaType = this._getMediaType();
    this.dispatchEvent(
      vdsEvent('vds-media-type-change', {
        detail: this.ctx.mediaType,
        originalEvent: event
      })
    );
  }

  protected _handlePlay(event: Event) {
    this._requestTimeUpdates();
    this.ctx.paused = false;
    this.dispatchEvent(vdsEvent('vds-play', { originalEvent: event }));
    if (this.ctx.ended) this.dispatchEvent(vdsEvent('vds-replay'));
    if (!this.ctx.started) {
      this.ctx.started = true;
      this.dispatchEvent(vdsEvent('vds-started', { originalEvent: event }));
    }
    this._validatePlaybackEndedState();
  }

  protected _handlePause(event: Event) {
    this._cancelTimeUpdates();
    this.ctx.paused = true;
    this.ctx.playing = false;
    this.ctx.waiting = false;
    this.dispatchEvent(vdsEvent('vds-pause', { originalEvent: event }));
  }

  protected _handlePlaying(event: Event) {
    this.ctx.playing = true;
    this.ctx.waiting = false;
    this.dispatchEvent(vdsEvent('vds-playing', { originalEvent: event }));
  }

  protected _handleDurationChange(event: Event) {
    this.ctx.duration = this.mediaElement!.duration;
    this.dispatchEvent(
      vdsEvent('vds-duration-change', {
        detail: this.ctx.duration,
        originalEvent: event
      })
    );
    this._validatePlaybackEndedState();
  }

  protected _handleProgress(event: Event) {
    this.ctx.buffered = this.mediaElement!.buffered;
    this.ctx.seekable = this.mediaElement!.seekable;
    this.dispatchEvent(vdsEvent('vds-progress', { originalEvent: event }));
  }

  protected _handleRateChange(event: Event) {
    // TODO: no-op for now but we'll add playback rate support later.
    throw Error('Not implemented');
  }

  protected _handleSeeked(event: Event) {
    this.ctx.currentTime = this.mediaElement!.currentTime;
    this.ctx.seeking = false;
    this.dispatchEvent(
      vdsEvent('vds-seeked', {
        detail: this.ctx.currentTime,
        originalEvent: event
      })
    );
    this._validatePlaybackEndedState();
  }

  protected _handleSeeking(event: Event) {
    this.ctx.currentTime = this.mediaElement!.currentTime;
    this.ctx.seeking = true;
    this.dispatchEvent(
      vdsEvent('vds-seeking', {
        detail: this.ctx.currentTime,
        originalEvent: event
      })
    );
  }

  protected _handleStalled(event: Event) {
    this.dispatchEvent(vdsEvent('vds-stalled', { originalEvent: event }));
  }

  protected _handleTimeUpdate(event: Event) {
    // -- Time updates are performed in `requestTimeUpdates()`.
    this.ctx.waiting = false;
    this._validatePlaybackEndedState();
  }

  protected _handleVolumeChange(event: Event) {
    this.ctx.volume = this.mediaElement!.volume;
    this.ctx.muted = this.mediaElement!.muted;
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.ctx.volume,
          muted: this.ctx.muted
        },
        originalEvent: event
      })
    );
  }

  protected _handleWaiting(event: Event) {
    this.ctx.waiting = true;
    this.dispatchEvent(vdsEvent('vds-waiting', { originalEvent: event }));
  }

  protected _handleSuspend(event: Event) {
    this.ctx.waiting = false;
    this.dispatchEvent(vdsEvent('vds-suspend', { originalEvent: event }));
  }

  protected _handleEnded(event: Event) {
    // Check becuase might've been handled in `validatePlaybackEnded()`.
    if (!this.ctx.ended && !this.loop) {
      this.ctx.ended = true;
      this.ctx.waiting = false;
      this.dispatchEvent(vdsEvent('vds-ended', { originalEvent: event }));
      this._cancelTimeUpdates();
    } else if (this.loop) {
      this.dispatchEvent(vdsEvent('vds-replay', { originalEvent: event }));
    }
  }

  protected _handleError(event: Event) {
    this.ctx.error = this.mediaElement!.error;
    this.dispatchEvent(
      vdsEvent('vds-error', {
        detail: this.mediaElement!.error,
        originalEvent: event
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  protected _getPaused() {
    return this.mediaElement!.paused;
  }

  protected _getVolume() {
    return this.mediaElement!.volume;
  }

  protected _setVolume(newVolume: number) {
    this.mediaElement!.volume = newVolume;
  }

  protected _getCurrentTime() {
    return this.mediaElement!.currentTime;
  }

  protected _setCurrentTime(newTime: number) {
    if (this.mediaElement!.currentTime !== newTime) {
      this.mediaElement!.currentTime = newTime;
      // Doesn't fire `seeked` near end.
      if (IS_SAFARI) this._validatePlaybackEndedState();
    }
  }

  protected _getMuted() {
    return this.mediaElement!.muted;
  }

  protected _setMuted(isMuted: boolean) {
    this.mediaElement!.muted = isMuted;
  }

  protected override async _handleMediaSrcChange(): Promise<void> {
    super._handleMediaSrcChange();

    if (!this._willAnotherEngineAttach()) {
      // Wait for `src` attribute to be updated on underlying `<audio>` or `<video>` element.
      await this.updateComplete;

      this._logger.debug('Calling `load()` on media element');

      this.mediaElement?.load();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine() {
    return this.mediaElement;
  }

  override get buffered() {
    if (isNil(this.mediaElement)) return new TimeRanges();
    return this.mediaElement.buffered;
  }

  /**
   * Returns a `MediaError` object for the most recent error, or `undefined` if there has not been
   * an error.
   *
   * @default undefined
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
   */
  override get error() {
    return this.mediaElement?.error ?? undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): CanPlay {
    if (isNil(this.mediaElement)) {
      return CanPlay.No;
    }

    return this.mediaElement.canPlayType(type) as CanPlay;
  }

  async play() {
    if (DEV_MODE) {
      this._logger.info('attempting to play...');
    }

    this._throwIfNotReadyForPlayback();
    if (this.ctx.ended) this.dispatchEvent(vdsEvent('vds-replay'));
    await this._resetPlaybackIfEnded();
    return this.mediaElement?.play();
  }

  async pause() {
    if (DEV_MODE) {
      this._logger.info('attempting to pause...');
    }

    this._throwIfNotReadyForPlayback();
    return this.mediaElement?.pause();
  }

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Returns a `MediaStream` object which is streaming a real-time capture
   * of the content being rendered in the media element. This method will return `undefined`
   * if this API is not available.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream
   */
  captureStream(): MediaStream | undefined {
    this._throwIfNotReadyForPlayback();
    return this.mediaElement?.captureStream?.();
  }

  /**
   * Resets the media element to its initial state and begins the process of selecting a media
   * source and loading the media in preparation for playback to begin at the beginning. The
   * amount of media data that is prefetched is determined by the value of the element's
   * `preload` attribute.
   *
   * 💡 You should generally not need to call this method as it's handled by the library.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
   */
  load(): void {
    this.mediaElement?.load();
  }

  protected _getMediaType(): MediaType {
    if (AUDIO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Audio;
    }

    if (VIDEO_EXTENSIONS.test(this.currentSrc)) {
      return MediaType.Video;
    }

    return MediaType.Unknown;
  }
}
