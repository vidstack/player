import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { DiscoveryEvent, dispatchDiscoveryEvents } from '../../base/elements';
import {
  DisposalBin,
  hostedEventListener,
  listen,
  vdsEvent
} from '../../base/events';
import { FullscreenController } from '../../base/fullscreen';
import { ElementLogger } from '../../base/logger';
import { createHostedRequestQueue, RequestQueue } from '../../base/queue';
import {
  ScreenOrientationController,
  ScreenOrientationLock
} from '../../base/screen-orientation';
import { clampNumber } from '../../utils/number';
import { notEqual } from '../../utils/unit';
import { CanPlay } from '../CanPlay';
import { MediaEvents } from '../events';
import { mediaServiceContext } from '../machine';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';

/**
 * Fired when the media provider connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaProviderConnectEvent = DiscoveryEvent<MediaProviderElement>;

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 *
 */
export abstract class MediaProviderElement extends LitElement {
  constructor() {
    super();
    dispatchDiscoveryEvents(this, 'vds-media-provider-connect');
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /* c8 ignore next */
  protected readonly _logger = __DEV__ && new ElementLogger(this);

  protected readonly _disconnectDisposal = new DisposalBin();

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('controls')) {
      this.mediaService.send({
        type: 'controls-change',
        controls: this.controls ?? false
      });
    }

    if (changedProperties.has('loop')) {
      this.mediaService.send({
        type: 'loop-change',
        loop: this.loop ?? false
      });
    }

    if (changedProperties.has('playsinline')) {
      this.mediaService.send({
        type: 'playsinline-change',
        playsinline: this.playsinline ?? false
      });
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.mediaService.send({
      type: 'can-fullscreen',
      supported: this.canRequestFullscreen
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.mediaRequestQueue.destroy();
    this._shouldSkipNextSrcChangeReset = false;
    this._disconnectDisposal.empty();
  }

  // -------------------------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------------------------

  /* c8 ignore next */
  protected _logMediaEvents() {
    /* c8 ignore start */
    if (__DEV__) {
      const mediaEvents: (keyof MediaEvents)[] = [
        'vds-abort',
        'vds-can-play',
        'vds-can-play-through',
        'vds-duration-change',
        'vds-emptied',
        'vds-ended',
        'vds-error',
        'vds-fullscreen-change',
        'vds-loaded-data',
        'vds-loaded-metadata',
        'vds-load-start',
        'vds-media-type-change',
        'vds-pause',
        'vds-play',
        'vds-playing',
        'vds-progress',
        'vds-seeked',
        'vds-seeking',
        'vds-stalled',
        'vds-started',
        'vds-suspend',
        'vds-replay',
        // 'vds-time-update',
        'vds-view-type-change',
        'vds-volume-change',
        'vds-waiting'
      ];

      mediaEvents.forEach((eventType) => {
        const dispose = listen(this, eventType, (event) => {
          this._logger
            .infoGroup(`📡 dispatching \`${eventType}\``)
            .appendWithLabel('Context', this.mediaState)
            .appendWithLabel('Event', event)
            .appendWithLabel('Engine', this.engine)
            .end();
        });

        this._disconnectDisposal.add(dispose);
      });
    }
    /* c8 ignore stop */
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * Whether playback should automatically begin as soon as enough media is available to do so
   * without interruption.
   *
   * Sites which automatically play audio (or videos with an audio track) can be an unpleasant
   * experience for users, so it should be avoided when possible. If you must offer autoplay
   * functionality, you should make it opt-in (requiring a user to specifically enable it).
   *
   * However, autoplay can be useful when creating media elements whose source will be set at a
   * later time, under user control.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay
   */
  @property({ type: Boolean, reflect: true })
  get autoplay() {
    return this.mediaState.autoplay;
  }

  set autoplay(shouldAutoplay: boolean) {
    this.mediaService.send({
      type: 'autoplay-change',
      autoplay: shouldAutoplay
    });

    if (this.canPlay && !this._autoplayAttemptPending && shouldAutoplay) {
      this._autoplayAttemptPending = true;

      const onAttemptEnd = () => {
        this._autoplayAttemptPending = false;
      };

      this._attemptAutoplay().then(onAttemptEnd).catch(onAttemptEnd);
    }
  }

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
   */
  @property({ type: Boolean, reflect: true })
  controls = false;

  /**
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
   */
  @property({ type: Boolean, reflect: true })
  loop = false;

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to `false` does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-playsinline
   */
  @property({ type: Boolean, reflect: true })
  playsinline = false;

  // --

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @default 1
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
   */
  @property({ type: Number, reflect: true })
  get volume() {
    return this.mediaState.volume;
  }

  set volume(requestedVolume) {
    this.mediaRequestQueue.queue('volume', () => {
      const volume = clampNumber(0, requestedVolume, 1);

      if (notEqual(this.volume, volume)) {
        this._setVolume(volume);
        this.requestUpdate('volume');
      }
    });
  }

  protected abstract _setVolume(newVolume: number): void;

  // ---

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `false` will begin/resume playback.
   *
   * @default true
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused
   */
  @property({ type: Boolean, reflect: true })
  get paused() {
    return this.mediaState.paused;
  }

  set paused(shouldPause) {
    this.mediaRequestQueue.queue('paused', () => {
      if (!shouldPause) {
        this.play();
      } else {
        this.pause();
      }

      this.requestUpdate('paused');
    });
  }

  // ---

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   *
   * @default 0
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
   */
  @property({ attribute: 'current-time', type: Number })
  get currentTime() {
    return this._getCurrentTime();
  }

  set currentTime(requestedTime) {
    this.mediaRequestQueue.queue('time', () => {
      if (notEqual(this.currentTime, requestedTime)) {
        this._setCurrentTime(requestedTime);
        this.requestUpdate('currentTime');
      }
    });
  }

  protected _getCurrentTime() {
    // Avoid errors where `currentTime` can have higher precision than duration.
    return Math.min(this.mediaState.currentTime, this.duration);
  }

  protected abstract _setCurrentTime(newTime: number): void;

  // ---

  /**
   * Whether the audio is muted or not.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted
   */
  @property({ type: Boolean, reflect: true })
  get muted() {
    return this.mediaState.muted;
  }

  set muted(shouldMute) {
    this.mediaRequestQueue.queue('muted', () => {
      if (notEqual(this.muted, shouldMute)) {
        this._setMuted(shouldMute);
        this.requestUpdate('muted');
      }
    });
  }

  protected abstract _setMuted(isMuted: boolean): void;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying engine that is actually responsible for rendering/loading media. Some examples
   * are:
   *
   * - The `VideoElement` engine is `HTMLVideoElement`.
   * - The `HlsElement` engine is the `hls.js` instance.
   * - The `YoutubeElement` engine is `HTMLIFrameElement`.
   *
   * Refer to the respective provider documentation to find out which engine is powering it.
   *
   * @abstract
   */
  abstract get engine(): unknown;

  /**
   * Returns an `Error` object when autoplay has failed to begin playback. This
   * can be used to determine when to show a recovery UI in the event autoplay fails.
   *
   * @default undefined
   */
  get autoplayError(): unknown {
    return this.mediaState.autoplayError;
  }

  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source that the
   * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
   * contiguous but if the user jumps about while media is buffering, it may contain holes.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
   * @default TimeRanges
   */
  get buffered() {
    return this.mediaState.buffered;
  }

  /**
   * Whether the user agent can play the media, but estimates that **not enough** data has been
   * loaded to play the media up to its end without having to stop for further buffering of
   * content.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
   */
  get canPlay() {
    return this.mediaState.canPlay;
  }

  /**
   * Whether the user agent can play the media, and estimates that enough data has been
   * loaded to play the media up to its end without having to stop for further buffering
   * of content.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
   */
  get canPlayThrough() {
    return this.mediaState.canPlayThrough;
  }

  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   *
   * @default ''
   */
  get currentPoster() {
    return this.mediaState.currentPoster;
  }

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @default ''
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
   */
  get currentSrc() {
    return this.mediaState.currentSrc;
  }

  /**
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `NaN`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @default NaN
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
   */
  get duration() {
    return this.mediaState.duration;
  }

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
   */
  get ended() {
    return this.mediaState.ended;
  }

  /**
   * Contains the most recent error or undefined if there's been none. You can listen for
   * `vds-error` event updates and examine this object to debug further. The error could be a
   * native `MediaError` object or something else.
   *
   * @default undefined
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
   */
  get error() {
    return this.mediaState.error;
  }

  /**
   * Whether the current media is a live stream.
   *
   * @default false
   */
  get live() {
    return this.mediaState.mediaType === MediaType.LiveVideo;
  }

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @default MediaType.Unknown
   */
  get mediaType() {
    return this.mediaState.mediaType;
  }

  /**
   * Contains the ranges of the media source that the browser has played, if any.
   *
   * @default TimeRanges
   */
  get played() {
    return this.mediaState.played;
  }

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @default false
   */
  get playing() {
    return this.mediaState.playing;
  }

  /**
   * Contains the time ranges that the user is able to seek to, if any. This tells us which parts
   * of the media can be played without delay; this is irrespective of whether that part has
   * been downloaded or not.
   *
   * Some parts of the media may be seekable but not buffered if byte-range
   * requests are enabled on the server. Byte range requests allow parts of the media file to
   * be delivered from the server and so can be ready to play almost immediately — thus they are
   * seekable.
   *
   * @default TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable
   */
  get seekable() {
    return this.mediaState.seekable;
  }

  /**
   * Whether media is actively seeking to an new playback position.
   *
   * @default false
   */
  get seeking() {
    return this.mediaState.seeking;
  }

  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @default false
   */
  get started() {
    return this.mediaState.started;
  }

  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   *
   * @default ViewType.Unknown
   */
  get viewType() {
    return this.mediaState.viewType;
  }

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @default false
   */
  get waiting() {
    return this.mediaState.waiting;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  /**
   * Determines if the media provider can play the given `type`. The `type` is
   * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
   *
   * @example `audio/mp3`
   * @example `video/mp4`
   * @example `video/webm; codecs="vp8, vorbis"`
   * @example `/my-audio-file.mp3`
   * @example `youtube/RO7VcUAsf-I`
   * @example `vimeo.com/411652396`
   * @example `https://www.youtube.com/watch?v=OQoz7FCWkfU`
   * @example `https://media.vidstack.io/hls/index.m3u8`
   * @example `https://media.vidstack.io/dash/index.mpd`
   * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
   */
  abstract canPlayType(type: string): CanPlay;

  /**
   * Determines if the media provider "should" play the given type. "Should" in this
   * context refers to the `canPlayType()` method returning `Maybe` or `Probably`.
   *
   * @param type refer to `canPlayType`.
   */
  shouldPlayType(type: string): boolean {
    const canPlayType = this.canPlayType(type);
    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
   */
  abstract play(): Promise<void>;

  /**
   * Pauses playback of the media.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause
   */
  abstract pause(): Promise<void>;

  /**
   * @throws {Error} - Will throw if media is not ready for playback.
   */
  protected _throwIfNotReadyForPlayback() {
    if (!this.canPlay) {
      throw Error(`Media is not ready - wait for \`vds-can-play\` event.`);
    }
  }

  protected async _resetPlayback(): Promise<void> {
    this._setCurrentTime(0);
  }

  protected async _resetPlaybackIfEnded(): Promise<void> {
    if (!this.ended || this.currentTime === 0) return;
    return this._resetPlayback();
  }

  /**
   * @throws {Error} - Will throw if player is not in a video view.
   */
  protected _throwIfNotVideoView() {
    if (this.viewType !== ViewType.Video) {
      throw Error('Player is currently not in a video view.');
    }
  }

  protected async _handleMediaReady({
    event,
    duration
  }: {
    event?: Event;
    duration: number;
  }) {
    if (this.canPlay) return;

    this.dispatchEvent(
      vdsEvent('vds-can-play', {
        originalEvent: event,
        detail: { duration }
      })
    );

    await this.mediaRequestQueue.start();

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup(
          '-------------------------- ✅ MEDIA READY -----------------------------------'
        )
        .appendWithLabel('Context', this.mediaState)
        .appendWithLabel('Event', event)
        .appendWithLabel('Engine', this.engine)
        .end();
    }
    /* c8 ignore stop */

    this._autoplayRetryCount = 0;
    this._autoplayAttemptPending = true;

    if (this.willAttemptAutoplay) {
      this.mediaService.send('autoplay');
      await this._attemptAutoplay();
    }

    this._autoplayAttemptPending = false;
  }

  protected _autoplayRetryCount = 0;
  protected _maxAutoplayRetries = 2;
  protected _shouldMuteLastAutoplayAttempt = true;
  protected _autoplayAttemptPending = false;

  get willAttemptAutoplay() {
    return (
      this.autoplay &&
      !this.started &&
      this._autoplayRetryCount < this._maxAutoplayRetries
    );
  }

  protected async _attemptAutoplay(): Promise<void> {
    if (!this.canPlay || !this.willAttemptAutoplay) {
      return;
    }

    // On last attempt try muted.
    const shouldTryMuted =
      !this.muted &&
      this._shouldMuteLastAutoplayAttempt &&
      this._autoplayRetryCount === this._maxAutoplayRetries - 1;

    let didAttemptSucceed = false;

    try {
      if (shouldTryMuted) this.muted = true;
      await this.play();
      didAttemptSucceed = true;
    } catch (error) {
      if (this._autoplayRetryCount === this._maxAutoplayRetries - 1) {
        this.mediaService.send({ type: 'autoplay-fail', error });
        this.requestUpdate();
      }
    }

    if (!didAttemptSucceed) {
      this._autoplayRetryCount += 1;
      return this._attemptAutoplay();
    }
  }

  protected _shouldSkipNextSrcChangeReset = true;

  protected _handleMediaSrcChange(src: string) {
    if (!this.hasUpdated) return;

    // Skip first flush to ensure initial properties set make it to the provider.
    if (this._shouldSkipNextSrcChangeReset) {
      this._shouldSkipNextSrcChangeReset = false;
      return;
    }

    /* c8 ignore start */
    if (__DEV__) {
      this._logger
        .infoGroup('📼 media src change')
        .appendWithLabel('Current src', this.currentSrc)
        .appendWithLabel('Engine', this.engine)
        .end();
    }
    /* c8 ignore stop */

    this.mediaRequestQueue.stop();
    this.mediaService.send({ type: 'src-change', src });
  }

  // -------------------------------------------------------------------------------------------
  // Services
  // -------------------------------------------------------------------------------------------

  readonly mediaServiceConsumer = mediaServiceContext.consume(this);

  /**
   * Media service used to keep track of current media state and context.
   * @internal
   */
  get mediaService() {
    return this.mediaServiceConsumer.value;
  }

  /**
   * A snapshot of the current media state.
   */
  get mediaState() {
    return Object.assign({}, this.mediaService.state.context);
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be applied safely after the element has connected to the DOM.
   */
  readonly _connectedQueue = createHostedRequestQueue(this);

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback, marked
   * by the `canPlay` property. If the media provider is ready, actions will be invoked immediately.
   */
  readonly mediaRequestQueue = new RequestQueue();

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  readonly screenOrientationController = new ScreenOrientationController(this);

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  readonly fullscreenController = new FullscreenController(
    this,
    this.screenOrientationController
  );

  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   */
  get canRequestFullscreen(): boolean {
    return this.fullscreenController.isSupported;
  }

  /**
   * Whether the player is currently in fullscreen mode.
   *
   * @default false
   */
  get fullscreen(): boolean {
    return this.mediaState.fullscreen;
  }

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  @property({ attribute: 'fullscreen-orientation' })
  get fullscreenOrientation(): ScreenOrientationLock | undefined {
    return this.fullscreenController.screenOrientationLock;
  }

  set fullscreenOrientation(lockType) {
    this.fullscreenController.screenOrientationLock = lockType;
  }

  override async requestFullscreen(): Promise<void> {
    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  exitFullscreen(): Promise<void> {
    return this.fullscreenController.exitFullscreen();
  }

  protected _handleFullscreenChange = hostedEventListener(
    this,
    'vds-fullscreen-change',
    (event) => {
      this.mediaService.send({
        type: 'fullscreen-change',
        fullscreen: event.detail
      });
    }
  );
}
