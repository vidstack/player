import { html, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';

import { listen, redispatchEvent, vdsEvent } from '../../base/events';
import {
  CanPlay,
  MediaProviderElement,
  MediaType,
  ViewType
} from '../../media';
import { getSlottedChildren } from '../../utils/dom';
import { getNumberOfDecimalPlaces } from '../../utils/number';
import { keysOf } from '../../utils/object';
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
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class Html5MediaElement extends MediaProviderElement {
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
  @property({ reflect: true })
  controlsList: MediaControlsList | undefined;

  /**
   * Whether to use CORS to fetch the related image.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin
   */
  @property({ reflect: true })
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
   * experience with regards to what content is loaded before the video is played.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload
   */
  @property({ reflect: true })
  preload: MediaPreloadOption | undefined;

  /**
   * The width of the media player.
   */
  @property({ type: Number, reflect: true })
  width: number | undefined;

  /**
   * The height of the media player.
   */
  @property({ type: Number, reflect: true })
  height: number | undefined;

  @state() protected __src = '';

  /**
   * The URL of a media resource to use.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src
   */
  @property()
  get src(): string {
    return this.__src;
  }

  set src(newSrc) {
    if (this.__src !== newSrc) {
      this.__src = newSrc;
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
    if (this.canLoad) {
      this._bindMediaEventListeners();
    }
  }

  override disconnectedCallback() {
    this._isMediaWaiting = false;
    this._hasAttachedSourceNodes = false;
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

  protected _timeRAF?: number = undefined;

  protected _cancelTimeUpdates() {
    if (isNumber(this._timeRAF)) window.cancelAnimationFrame(this._timeRAF);
    this._timeRAF = undefined;
  }

  protected _requestTimeUpdates() {
    // Time updates are already in progress.
    if (!isUndefined(this._timeRAF)) return;
    this._requestTimeUpdate();
  }

  protected _requestTimeUpdate() {
    const newTime = this.mediaElement?.currentTime ?? 0;

    if (this.currentTime !== newTime) {
      this._updateCurrentTime(newTime);
    }

    this._timeRAF = window.requestAnimationFrame(() => {
      if (isUndefined(this._timeRAF)) return;
      this._requestTimeUpdate();
    });
  }

  protected _updateCurrentTime(newTime: number, triggerEvent?: Event) {
    this.dispatchEvent(
      vdsEvent('vds-time-update', {
        // Avoid errors where `currentTime` can have higher precision than duration.
        detail: Math.min(newTime, this.duration),
        triggerEvent
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Slots
  // -------------------------------------------------------------------------------------------

  protected _handleDefaultSlotChange() {
    if (isNil(this.mediaElement) || !this.canLoad) return;
    this._cancelTimeUpdates();
    this._cleanupOldSourceNodes();
    this._attachNewSourceNodes();
  }

  protected _cleanupOldSourceNodes() {
    const nodes = this.mediaElement?.querySelectorAll('source,track');
    nodes?.forEach((node) => node.remove());
    this._hasAttachedSourceNodes = false;
  }

  protected _hasAttachedSourceNodes = false;
  protected _attachNewSourceNodes() {
    if (!this.canLoad || this._hasAttachedSourceNodes) return;

    const validTags = new Set(['source', 'track']);

    const nodes = getSlottedChildren(this).filter((node) =>
      validTags.has(node.tagName.toLowerCase())
    );

    const initialSrc = (nodes[0] as HTMLSourceElement)?.src;
    if (initialSrc) {
      this.__src = initialSrc;
    }

    if (__DEV__ && nodes.length > 0) {
      this._logger
        ?.infoGroup('Found `<source>` and/or `<track>` elements')
        .labelledLog('Nodes', nodes)
        .dispatch();
    }

    nodes.forEach((node) => this.mediaElement?.appendChild(node.cloneNode()));

    window.requestAnimationFrame(async () => {
      await this._handleMediaSrcChange();
    });

    this._hasAttachedSourceNodes = true;
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  // An un-debounced waiting tracker (this.waiting is debounced inside the media controller).
  protected _isMediaWaiting = false;

  override async handleMediaCanLoad() {
    await super.handleMediaCanLoad();

    this._bindMediaEventListeners();

    if (getSlottedChildren(this).length > 0) {
      this._attachNewSourceNodes();
    }
  }

  protected _isListeningToMediaElement = false;
  protected _bindMediaEventListeners() {
    if (isNil(this.mediaElement) || this._isListeningToMediaElement) return;

    const eventListeners = {
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
      // timeupdate: this._handleTimeUpdate,
      volumechange: this._handleVolumeChange,
      waiting: this._handleWaiting
    };

    keysOf(eventListeners).forEach((type) => {
      const handler = eventListeners[type].bind(this);
      this._disconnectDisposal.add(
        listen(this.mediaElement!, type, async (event: Event) => {
          if (__DEV__) {
            this._logger
              ?.debugGroup(`📺 fired \`${event.type}\``)
              .labelledLog('Event', event)
              .labelledLog('Engine', this.engine)
              .labelledLog('State', { ...this.mediaState })
              .dispatch();
          }

          await handler(event);

          // re-dispatch native event for spec-compliance.
          redispatchEvent(this, event);

          this.requestUpdate();
        })
      );
    });

    if (__DEV__) {
      this._logger?.debug('attached event listeners');
    }

    this._isListeningToMediaElement = true;
    this._disconnectDisposal.add(() => {
      this._isListeningToMediaElement = false;
    });
  }

  protected _handleAbort(event: Event) {
    this.dispatchEvent(vdsEvent('vds-abort', { triggerEvent: event }));
  }

  protected _handleCanPlay(event: Event) {
    if (this.mediaState.canPlay) return;
    if (!this._willAnotherEngineAttach())
      this._handleMediaReady({ event, duration: this.mediaElement!.duration });
  }

  protected _handleCanPlayThrough(event: Event) {
    if (this.started) return;
    this.dispatchEvent(
      vdsEvent('vds-can-play-through', {
        triggerEvent: event,
        detail: { duration: this.mediaElement!.duration }
      })
    );
  }

  protected _handleLoadStart(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-load-start', {
        triggerEvent: event,
        detail: {
          src: this.mediaElement!.currentSrc,
          poster: this.currentPoster,
          mediaType: this._getMediaType(),
          viewType: this._getViewType()
        }
      })
    );
  }

  protected _handleEmptied(event: Event) {
    this.dispatchEvent(vdsEvent('vds-emptied', { triggerEvent: event }));
  }

  protected _handleLoadedData(event: Event) {
    this.dispatchEvent(vdsEvent('vds-loaded-data', { triggerEvent: event }));
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   */
  protected _willAnotherEngineAttach(): boolean {
    return false;
  }

  // For `hls.js` or any engine to mark ready state when metadata has loaded.
  protected get _mediaReadyOnMetadataLoad() {
    return false;
  }

  protected _handleLoadedMetadata(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-duration-change', {
        detail: this.mediaElement!.duration,
        triggerEvent: event
      })
    );

    this.dispatchEvent(
      vdsEvent('vds-loaded-metadata', {
        triggerEvent: event,
        detail: {
          src: this.mediaElement!.currentSrc,
          duration: this.mediaElement!.duration
        }
      })
    );

    this._determineMediaType(event);

    if (this._mediaReadyOnMetadataLoad) {
      this._handleMediaReady({
        event,
        duration: this.mediaElement!.duration
      });
    }
  }

  protected _determineMediaType(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-media-type-change', {
        detail: this._getMediaType(),
        triggerEvent: event
      })
    );
  }

  protected _handlePlay(event: Event) {
    const playEvent = vdsEvent('vds-play', { triggerEvent: event });
    playEvent.autoplay = this._autoplayAttemptPending;
    this.dispatchEvent(playEvent);
  }

  protected _handlePause(event: Event) {
    // Avoid seeking events triggering pause.
    if (this.readyState === 1 && !this._isMediaWaiting) {
      return;
    }

    this._isMediaWaiting = false;
    this._cancelTimeUpdates();
    this.dispatchEvent(vdsEvent('vds-pause', { triggerEvent: event }));
  }

  protected _handlePlaying(event: Event) {
    this._isMediaWaiting = false;
    const playingEvent = vdsEvent('vds-playing', { triggerEvent: event });
    this.dispatchEvent(playingEvent);
    this._requestTimeUpdates();
  }

  protected _handleDurationChange(event: Event) {
    if (this.ended) {
      this._updateCurrentTime(this.mediaElement!.duration, event);
    }

    this.dispatchEvent(
      vdsEvent('vds-duration-change', {
        detail: this.mediaElement!.duration,
        triggerEvent: event
      })
    );
  }

  protected _handleProgress(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-progress', {
        triggerEvent: event,
        detail: {
          buffered: this.mediaElement!.buffered,
          seekable: this.mediaElement!.seekable
        }
      })
    );
  }

  protected _handleRateChange(event: Event) {
    // TODO: no-op for now but we'll add playback rate support later.
    throw Error('Not implemented');
  }

  protected _handleSeeking(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-seeking', {
        detail: this.mediaElement!.currentTime,
        triggerEvent: event
      })
    );
  }

  protected _handleSeeked(event: Event) {
    const seekedEvent = vdsEvent('vds-seeked', {
      detail: this.mediaElement!.currentTime,
      triggerEvent: event
    });

    this.dispatchEvent(seekedEvent);

    const currentTime = this.mediaElement!.currentTime;

    // HLS: If precision has increased by seeking to the end, we'll call `play()` to properly end.
    if (
      Math.trunc(currentTime) === Math.trunc(this.duration) &&
      getNumberOfDecimalPlaces(this.duration) >
        getNumberOfDecimalPlaces(currentTime)
    ) {
      this._updateCurrentTime(this.duration, event);

      if (!this.ended) {
        try {
          this.play();
        } catch (e) {
          // no-op
        }
      }
    }
  }

  protected _handleStalled(event: Event) {
    this.dispatchEvent(vdsEvent('vds-stalled', { triggerEvent: event }));

    if (this.readyState < 3) {
      this._isMediaWaiting = true;
      this.dispatchEvent(vdsEvent('vds-waiting', { triggerEvent: event }));
    }
  }

  protected _handleVolumeChange(event: Event) {
    this.dispatchEvent(
      vdsEvent('vds-volume-change', {
        detail: {
          volume: this.mediaElement!.volume,
          muted: this.mediaElement!.muted
        },
        triggerEvent: event
      })
    );
  }

  protected _handleWaiting(event: Event) {
    if (this.readyState < 3) {
      this._isMediaWaiting = true;
      this.dispatchEvent(vdsEvent('vds-waiting', { triggerEvent: event }));
    }
  }

  protected _handleSuspend(event: Event) {
    const suspendEvent = vdsEvent('vds-suspend', { triggerEvent: event });
    this.dispatchEvent(suspendEvent);
  }

  protected _handleEnded(event: Event) {
    this._cancelTimeUpdates();

    this._updateCurrentTime(this.duration, event);

    const endEvent = vdsEvent('vds-end', { triggerEvent: event });
    this.dispatchEvent(endEvent);

    if (this.loop) {
      this._handleLoop();
    } else {
      this.dispatchEvent(vdsEvent('vds-ended', { triggerEvent: event }));
    }
  }

  protected _handleLoop() {
    const hasCustomControls = isUndefined(this.controls);

    // Forcefully hide controls to prevent flashing when looping. Calling `play()` at end
    // of media may show a flash of native controls on iOS, even if `controls` property is not set.
    if (hasCustomControls) {
      this.mediaElement!.controls = false;
    }

    this.dispatchEvent(vdsEvent('vds-loop-request'));
  }

  protected _handleError(event: Event) {
    const mediaError = this.mediaElement!.error;
    if (!mediaError) return;

    this.dispatchEvent(
      vdsEvent('vds-error', {
        detail: {
          message: mediaError.message,
          code: mediaError.code,
          mediaError: mediaError
        },
        triggerEvent: event
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

  protected _setCurrentTime(newTime: number) {
    if (this.mediaElement!.currentTime !== newTime) {
      this.mediaElement!.currentTime = newTime;
    }
  }

  protected _getMuted() {
    return this.mediaElement!.muted;
  }

  protected _setMuted(isMuted: boolean) {
    this.mediaElement!.muted = isMuted;
  }

  protected override async _handleMediaSrcChange(): Promise<void> {
    this._isMediaWaiting = false;

    await super._handleMediaSrcChange(this.src);

    if (!this._willAnotherEngineAttach()) {
      // Wait for `src` attribute to be updated on underlying `<audio>` or `<video>` element.
      await this.updateComplete;

      if (__DEV__) {
        this._logger?.debug('Calling `load()` on media element');
      }

      if (this.canLoad) {
        this.mediaElement?.load();
      }
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
    if (__DEV__) {
      this._logger?.info('attempting to play...');
    }

    try {
      this._throwIfNotReadyForPlayback();
      await this._resetPlaybackIfEnded();
      return this.mediaElement?.play();
    } catch (error) {
      const playErrorEvent = vdsEvent('vds-play-fail');
      playErrorEvent.autoplay = this._autoplayAttemptPending;
      playErrorEvent.error = error as Error;
      throw error;
    }
  }

  async pause() {
    if (__DEV__) {
      this._logger?.info('attempting to pause...');
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

  protected _getViewType(): ViewType {
    const mediaType = this._getMediaType();

    if (mediaType === MediaType.Video || mediaType === MediaType.LiveVideo) {
      return ViewType.Video;
    }

    if (mediaType === MediaType.Audio) {
      return ViewType.Audio;
    }

    return ViewType.Unknown;
  }
}
