import { VdsElement } from '../../foundation/elements/index.js';
import { FullscreenController } from '../../foundation/fullscreen/index.js';
import { RequestQueue } from '../../foundation/queue/index.js';
import {
  ScreenOrientationController,
  ScreenOrientationLock
} from '../../foundation/screen-orientation/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../foundation/storybook/index.js';
import { CanPlay } from '../CanPlay.js';
import { createMediaContextRecord, mediaContext } from '../context.js';
import {
  AbortEvent,
  CanPlayEvent,
  CanPlayThroughEvent,
  DurationChangeEvent,
  EmptiedEvent,
  EndedEvent,
  ErrorEvent,
  FullscreenChangeEvent,
  LoadedDataEvent,
  LoadedMetadataEvent,
  LoadStartEvent,
  MediaTypeChangeEvent,
  PauseEvent,
  PlayEvent,
  PlayingEvent,
  ProgressEvent,
  ReplayEvent,
  SeekedEvent,
  SeekingEvent,
  StalledEvent,
  StartedEvent,
  SuspendEvent,
  TimeUpdateEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
  WaitingEvent
} from '../events.js';
import { MediaType } from '../MediaType.js';
import { ViewType } from '../ViewType.js';
import { MediaProviderConnectEvent } from './events.js';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 *
 */
export class MediaProviderElement extends VdsElement {
  /** @type {string[]} */
  static get events() {
    return [
      AbortEvent.TYPE,
      CanPlayEvent.TYPE,
      CanPlayThroughEvent.TYPE,
      DurationChangeEvent.TYPE,
      EmptiedEvent.TYPE,
      EndedEvent.TYPE,
      ErrorEvent.TYPE,
      FullscreenChangeEvent.TYPE,
      LoadedDataEvent.TYPE,
      LoadedMetadataEvent.TYPE,
      LoadStartEvent.TYPE,
      MediaTypeChangeEvent.TYPE,
      PauseEvent.TYPE,
      PlayEvent.TYPE,
      PlayingEvent.TYPE,
      ProgressEvent.TYPE,
      ReplayEvent.TYPE,
      SeekedEvent.TYPE,
      SeekingEvent.TYPE,
      StalledEvent.TYPE,
      StartedEvent.TYPE,
      SuspendEvent.TYPE,
      TimeUpdateEvent.TYPE,
      ViewTypeChangeEvent.TYPE,
      VolumeChangeEvent.TYPE,
      WaitingEvent.TYPE,
      MediaProviderConnectEvent.TYPE
    ];
  }

  constructor() {
    super();

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
     * @type {boolean}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay
     */
    this.autoplay = false;

    /**
     * Indicates whether a user interface should be shown for controlling the resource. Set this to
     * `false` when you want to provide your own custom controls, and `true` if you want the current
     * provider to supply its own default controls. Depending on the provider, changing this prop
     * may cause the player to completely reset.
     *
     * @type {boolean}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
     */
    this.controls = false;

    /**
     * Whether media should automatically start playing from the beginning (replay) every time
     * it ends.
     *
     * @type {boolean}
     * @default false
     * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
     */
    this.loop = false;

    /**
     * Whether the video is to be played "inline", that is within the element's playback area. Note
     * that setting this to `false` does not imply that the video will always be played in fullscreen.
     * Depending on the provider, changing this prop may cause the player to completely reset.
     *
     * @type {boolean}
     */
    this.playsinline = false;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this.addFullscreenController(this.fullscreenController);
    this.dispatchDiscoveryEvent();
    this.connectedQueue.flush();
    this.connectedQueue.serveImmediately = true;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('autoplay')) {
      this.context.autoplay = this.autoplay;
    }

    if (changedProperties.has('controls')) {
      this.context.controls = this.controls;
    }

    if (changedProperties.has('loop')) {
      this.context.loop = this.loop;
    }

    if (changedProperties.has('playsinline')) {
      this.context.playsinline = this.playsinline;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.connectedQueue.destroy();
    this.mediaRequestQueue.destroy();
    this.hasFlushedMediaRequestQueueOnce = false;
  }

  // -------------------------------------------------------------------------------------------
  // Discovery
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   */
  dispatchDiscoveryEvent() {
    this.dispatchEvent(
      new MediaProviderConnectEvent({
        detail: {
          provider: this,
          // Pipe callbacks into the disconnect disposal bin.
          onDisconnect: (callback) => {
            this.disconnectDisposal.add(callback);
          }
        }
      })
    );
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      paused: { type: Boolean },
      muted: { type: Boolean },
      autoplay: { type: Boolean },
      controls: { type: Boolean },
      loop: { type: Boolean },
      playsinline: { type: Boolean },
      volume: { type: Number },
      currentTime: { type: Number, attribute: 'current-time' },
      fullscreenOrientation: { attribute: 'fullscreen-orientation' }
    };
  }

  // --

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @type {number}
   * @default 1
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
   */
  get volume() {
    return this.canPlay ? this.getVolume() : 1;
  }

  set volume(requestedVolume) {
    this.mediaRequestQueue.queue('volume', () => {
      this.setVolume(requestedVolume);
    });
  }

  /**
   * @protected
   * @abstract
   * @returns {number}
   */
  getVolume() {
    throw Error('Not implemented.');
  }

  /**
   * @protected
   * @abstract
   * @param {number} newVolume
   */
  setVolume(newVolume) {
    throw Error('Not implemented.');
  }

  // ---

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `false` will begin/resume playback.
   *
   * @type {boolean}
   * @default true
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused
   */
  get paused() {
    return this.canPlay ? this.getPaused() : true;
  }

  /** @param {boolean} shouldPause */
  set paused(shouldPause) {
    this.mediaRequestQueue.queue('paused', () => {
      if (!shouldPause) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  /**
   * @protected
   * @abstract
   * @returns {boolean}
   */
  getPaused() {
    throw Error('Not implemented.');
  }

  // ---

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   *
   * @type {number}
   * @default 0
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
   */
  get currentTime() {
    return this.canPlay ? this.getCurrentTime() : 0;
  }

  /** @param {number} requestedTime */
  set currentTime(requestedTime) {
    this.mediaRequestQueue.queue('time', () => {
      this.setCurrentTime(requestedTime);
    });
  }

  /**
   * @protected
   * @abstract
   * @returns {number}
   */
  getCurrentTime() {
    throw Error('Not implemented.');
  }

  /**
   * @protected
   * @abstract
   * @param {number} newTime
   */
  setCurrentTime(newTime) {
    throw Error('Not implemented.');
  }

  // ---

  /**
   * Whether the audio is muted or not.
   *
   * @type {boolean}
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted
   */
  get muted() {
    return this.canPlay ? this.getMuted() : false;
  }

  /** @param {boolean} shouldMute */
  set muted(shouldMute) {
    this.mediaRequestQueue.queue('muted', () => {
      this.setMuted(shouldMute);
    });
  }

  /**
   * @protected
   * @abstract
   * @returns {boolean}
   */
  getMuted() {
    throw Error('Not implemented.');
  }

  /**
   * @protected
   * @abstract
   * @param {boolean} isMuted
   */
  setMuted(isMuted) {
    throw Error('Not implemented.');
  }

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
   * @type {unknown}
   */
  get engine() {
    throw Error('Not implemented.');
  }

  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source that the
   * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
   * contiguous but if the user jumps about while media is buffering, it may contain holes.
   *
   * @type {TimeRanges}
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
   * @default TimeRanges
   */
  get buffered() {
    return this.context.buffered;
  }

  /**
   * Whether the user agent can play the media, but estimates that **not enough** data has been
   * loaded to play the media up to its end without having to stop for further buffering of
   * content.
   *
   * @type {boolean}
   * @default false
   */
  get canPlay() {
    return this.context.canPlay;
  }

  /**
   * Whether the user agent can play the media, and estimates that enough data has been
   * loaded to play the media up to its end without having to stop for further buffering
   * of content.
   *
   * @type {boolean}
   * @default false
   */
  get canPlayThrough() {
    return this.context.canPlayThrough;
  }

  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   *
   * @type {string}
   */
  get currentPoster() {
    return this.context.currentPoster;
  }

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @type {string}
   * @default ''
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
   */
  get currentSrc() {
    return this.context.currentSrc;
  }

  /**
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `NaN`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @type {number}
   * @default NaN
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
   */
  get duration() {
    return this.context.duration;
  }

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @type {boolean}
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
   */
  get ended() {
    return this.context.ended;
  }

  /**
   * Contains the most recent error or undefined if there's been none. You can listen for
   * `vds-error` event updates and examine this object to debug further. The error could be a
   * native `MediaError` object or something else.
   *
   * @type {unknown}
   * @default undefined
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
   */
  get error() {
    return this.context.error;
  }

  /**
   * Whether the current media is a live stream.
   *
   * @type {boolean}
   */
  get live() {
    return this.context.live;
  }

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @type {MediaType}
   * @default MediaType.Unknown
   */
  get mediaType() {
    return this.context.mediaType;
  }

  /**
   * Contains the ranges of the media source that the browser has played, if any.
   *
   * @type {TimeRanges}
   * @default TimeRanges
   */
  get played() {
    return this.context.played;
  }

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @type {boolean}
   * @default false
   */
  get playing() {
    return this.context.playing;
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
   * @type {TimeRanges}
   * @default TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable
   */
  get seekable() {
    return this.context.seekable;
  }

  /**
   * Whether media is actively seeking to an new playback position.
   *
   * @type {boolean}
   * @default false
   */
  get seeking() {
    return this.context.seeking;
  }

  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @type {boolean}
   * @default false
   */
  get started() {
    return this.context.started;
  }

  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   *
   * @type {ViewType}
   * @default ViewType.Unknown
   */
  get viewType() {
    return this.context.viewType;
  }

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @type {boolean}
   * @default false
   */
  get waiting() {
    return this.context.waiting;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  /**
   * Determines if the media provider can play the given `type`. The `type` is
   * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
   *
   * @abstract
   * @param {string} type
   * @returns {CanPlay}
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
  canPlayType(type) {
    throw Error('Not implemented');
  }

  /**
   * Determines if the media provider "should" play the given type. "Should" in this
   * context refers to the `canPlayType()` method returning `Maybe` or `Probably`.
   *
   * @param {string} type refer to `canPlayType`.
   * @returns {boolean}
   */
  shouldPlayType(type) {
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
   * @abstract
   * @returns {Promise<void>}
   */
  async play() {}

  /**
   * Pauses playback of the media.
   *
   * @abstract
   * @returns {Promise<void>}
   */
  async pause() {}

  /**
   * @protected
   * @throws {Error} - Will throw if media is not ready for playback.
   */
  throwIfNotReadyForPlayback() {
    if (!this.canPlay) {
      throw Error(
        `Media is not ready - wait for \`${CanPlayEvent.TYPE}\` event.`
      );
    }
  }

  /**
   * @protected
   * @returns {boolean}
   */
  hasPlaybackRoughlyEnded() {
    if (isNaN(this.duration) || this.duration === 0) return false;
    return (
      Math.abs(
        Math.round(this.duration * 10) - Math.round(this.currentTime * 10)
      ) <= 1
    );
  }

  /**
   * Call if you suspect that playback might have resumed/ended again.
   *
   * @protected
   */
  validatePlaybackEndedState() {
    if (this.context.ended && !this.hasPlaybackRoughlyEnded()) {
      this.context.ended = false;
    } else if (!this.context.ended && this.hasPlaybackRoughlyEnded()) {
      this.context.waiting = false;
      this.dispatchEvent(new SuspendEvent());
      this.context.ended = true;
      this.dispatchEvent(new EndedEvent());
    }
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async resetPlayback() {
    this.setCurrentTime(0);
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async resetPlaybackIfEnded() {
    if (!this.hasPlaybackRoughlyEnded()) return;
    return this.resetPlayback();
  }

  /**
   * @protected
   * @throws {Error} - Will throw if player is not in a video view.
   */
  throwIfNotVideoView() {
    if (!this.context.isVideoView) {
      throw Error('Player is currently not in a video view.');
    }
  }

  /**
   * @protected
   * @param {Event} [event]
   */
  handleMediaReady(event) {
    this.context.canPlay = true;
    this.dispatchEvent(new CanPlayEvent({ originalEvent: event }));
    this.mediaRequestQueue.flush();
    this.mediaRequestQueue.serveImmediately = true;
  }

  /**
   * @protected
   * @type {boolean}
   */
  hasFlushedMediaRequestQueueOnce = false;

  /**
   * @protected
   */
  handleMediaSrcChange() {
    // Skip first flush to ensure initial properties set make it to the provider.
    if (!this.hasFlushedMediaRequestQueueOnce) {
      this.hasFlushedMediaRequestQueueOnce = true;
      return;
    }

    this.mediaRequestQueue.serveImmediately = false;
    this.mediaRequestQueue.reset();
    this.softResetMediaContext();
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * Any property updated inside this object will trigger a context update. The media controller
   * will provide (inject) the context record to be managed by this media provider. Any updates here
   * will flow down from the media controller to all components.
   *
   * If there's no media controller then this will be a plain JS object that's used to keep
   * track of media state.
   *
   * @readonly
   * @internal
   */
  context = createMediaContextRecord();

  /**
   * Media context properties that should be reset when media is changed. Override this
   * to include additional properties.
   *
   * @protected
   * @returns {Set<string>}
   */
  getMediaPropsToResetWhenSrcChanges() {
    return new Set([
      'buffered',
      'buffering',
      'canPlay',
      'canPlayThrough',
      'currentSrc',
      'currentTime',
      'duration',
      'ended',
      'mediaType',
      'paused',
      'canPlay',
      'played',
      'playing',
      'seekable',
      'seeking',
      'started',
      'waiting'
    ]);
  }

  /**
   * When the `currentSrc` is changed this method is called to update any context properties
   * that need to be reset. Important to note that not all properties are reset, only the
   * properties returned from `getSoftResettableMediaContextProps()`.
   *
   * @protected
   */
  softResetMediaContext() {
    const propsToReset = this.getMediaPropsToResetWhenSrcChanges();
    Object.keys(mediaContext).forEach((prop) => {
      if (propsToReset.has(prop)) {
        this.context[prop] = mediaContext[prop].initialValue;
      }
    });
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be applied safely after the element has connected to the DOM.
   *
   * @protected
   * @readonly
   */
  connectedQueue = new RequestQueue();

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback, marked
   * by the `canPlay` property. If the media provider is ready, actions will be invoked immediately.
   *
   * @readonly
   */
  mediaRequestQueue = new RequestQueue();

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  screenOrientationController = new ScreenOrientationController(this);

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  fullscreenController = new FullscreenController(
    this,
    this.screenOrientationController
  );

  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @type {boolean}
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   */
  get canRequestFullscreen() {
    return this.fullscreenController.isSupported;
  }

  /**
   * Whether the player is currently in fullscreen mode.
   *
   * @type {boolean}
   * @default false
   */
  get fullscreen() {
    return this.fullscreenController.isFullscreen;
  }

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   *
   * @attribute fullscreen-orientation
   * @type {ScreenOrientationLock | undefined}
   */
  get fullscreenOrientation() {
    return this.fullscreenController.screenOrientationLock;
  }

  set fullscreenOrientation(lockType) {
    this.fullscreenController.screenOrientationLock = lockType;
  }

  /** @returns {Promise<void>} */
  requestFullscreen() {
    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  /** @returns {Promise<void>} */
  exitFullscreen() {
    return this.fullscreenController.exitFullscreen();
  }

  /**
   * This can be used to add additional fullscreen controller event listeners to update the
   * appropriate contexts and dispatch events.
   *
   * @param {FullscreenController} controller
   * @returns {() => void}
   */
  addFullscreenController(controller) {
    return controller.addDelegate({
      handleFullscreenChange: this.handleFullscreenChange.bind(this),
      handleFullscreenError: this.handleFullscreenError.bind(this)
    });
  }

  /**
   * @protected
   * @param {FullscreenController} controller
   * @param {Event} [event]
   */
  handleFullscreenChange(controller, event) {
    this.context.fullscreen = controller.isFullscreen;
    this.dispatchEvent(
      new FullscreenChangeEvent({
        detail: controller.isFullscreen,
        originalEvent: event
      })
    );
  }

  /**
   * @protected
   * @param {FullscreenController} controller
   * @param {Event} [event]
   */
  handleFullscreenError(controller, event) {
    this.context.error = event;
    this.dispatchEvent(
      new ErrorEvent({
        detail: event,
        originalEvent: event
      })
    );
  }
}

export const MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  autoplay: { control: false },
  controls: { control: StorybookControlType.Boolean, defaultValue: true },
  currentTime: { control: StorybookControlType.Number, defaultValue: 0 },
  loop: { control: StorybookControlType.Boolean },
  muted: { control: StorybookControlType.Boolean },
  paused: { control: StorybookControlType.Boolean, defaultValue: true },
  playsinline: { control: StorybookControlType.Boolean },
  volume: { control: StorybookControlType.Number, defaultValue: 0.5 },
  // Media Actions
  onAbort: storybookAction(AbortEvent.TYPE),
  onCanPlay: storybookAction(CanPlayEvent.TYPE),
  onCanPlayThrough: storybookAction(CanPlayThroughEvent.TYPE),
  onDurationChange: storybookAction(DurationChangeEvent.TYPE),
  onEmptied: storybookAction(EmptiedEvent.TYPE),
  onEnded: storybookAction(EndedEvent.TYPE),
  onError: storybookAction(ErrorEvent.TYPE),
  onFullscreenChange: storybookAction(FullscreenChangeEvent.TYPE),
  onLoadedData: storybookAction(LoadedDataEvent.TYPE),
  onLoadedMetadata: storybookAction(LoadedMetadataEvent.TYPE),
  onLoadStart: storybookAction(LoadStartEvent.TYPE),
  onMediaTypeChange: storybookAction(MediaTypeChangeEvent.TYPE),
  onPause: storybookAction(PauseEvent.TYPE),
  onPlay: storybookAction(PlayEvent.TYPE),
  onPlaying: storybookAction(PlayingEvent.TYPE),
  onProgress: storybookAction(ProgressEvent.TYPE),
  onReplay: storybookAction(ReplayEvent.TYPE),
  onSeeked: storybookAction(SeekedEvent.TYPE),
  onSeeking: storybookAction(SeekingEvent.TYPE),
  onStalled: storybookAction(StalledEvent.TYPE),
  onStarted: storybookAction(StartedEvent.TYPE),
  onSuspend: storybookAction(SuspendEvent.TYPE),
  onTimeUpdate: storybookAction(TimeUpdateEvent.TYPE),
  onViewTypeChange: storybookAction(ViewTypeChangeEvent.TYPE),
  onVolumeChange: storybookAction(VolumeChangeEvent.TYPE),
  onWaiting: storybookAction(WaitingEvent.TYPE),
  // Media Provider Actions
  onMediaProviderConnect: storybookAction(MediaProviderConnectEvent.TYPE)
};
