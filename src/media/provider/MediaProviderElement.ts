import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { ExtractContextRecordTypes } from '../../base/context';
import { discover, DiscoveryEvent } from '../../base/elements';
import {
  DisposalBin,
  eventListener,
  listen,
  vdsEvent
} from '../../base/events';
import {
  FullscreenChangeEvent,
  FullscreenController
} from '../../base/fullscreen';
import { ElementLogger } from '../../base/logger';
import { RequestQueue } from '../../base/queue';
import {
  ScreenOrientationController,
  ScreenOrientationLock
} from '../../base/screen-orientation';
import { DEV_MODE } from '../../env';
import { clampNumber } from '../../utils/number';
import { CanPlay } from '../CanPlay';
import {
  cloneMediaContextRecord,
  createMediaContextRecord,
  mediaContext
} from '../context';
import { MediaEvents } from '../events';

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
@discover('vds-media-provider-connect')
export abstract class MediaProviderElement extends LitElement {
  static get events(): (keyof GlobalEventHandlersEventMap)[] {
    return [
      'vds-abort',
      'vds-can-play',
      'vds-can-play-through',
      'vds-duration-change',
      'vds-emptied',
      'vds-ended',
      'vds-error',
      'vds-fullscreen-change',
      'vds-loaded-data',
      'vds-load-start',
      'vds-loaded-metadata',
      'vds-media-type-change',
      'vds-pause',
      'vds-play',
      'vds-playing',
      'vds-progress',
      'vds-replay',
      'vds-seeked',
      'vds-seeking',
      'vds-stalled',
      'vds-started',
      'vds-suspend',
      'vds-time-update',
      'vds-view-type-change',
      'vds-volume-change',
      'vds-waiting',
      'vds-media-provider-connect'
    ];
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  protected readonly _disconnectDisposal = new DisposalBin(
    this,
    DEV_MODE && { name: 'disconnectDisposal', owner: this }
  );

  override connectedCallback() {
    if (DEV_MODE) {
      this._logMediaEvents();
    }

    super.connectedCallback();
    this._connectedQueue.flush();
    this._connectedQueue.serveImmediately = true;
  }

  protected override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('autoplay')) {
      this.ctx.autoplay = this.autoplay;
      this._attemptAutoplay();
    }

    if (changedProperties.has('controls')) {
      this.ctx.controls = this.controls;
    }

    if (changedProperties.has('loop')) {
      this.ctx.loop = this.loop;
    }

    if (changedProperties.has('playsinline')) {
      this.ctx.playsinline = this.playsinline;
    }

    super.updated(changedProperties);
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.ctx.canRequestFullscreen = this.canRequestFullscreen;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._connectedQueue.destroy();
    this.mediaRequestQueue.destroy();
    this._shouldSkipNextSrcChangeReset = false;
    this._disconnectDisposal.empty();
  }

  // -------------------------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------------------------

  protected _logMediaEvents() {
    if (DEV_MODE) {
      const mediaEvents: (keyof MediaEvents)[] = [
        'vds-abort',
        'vds-can-play',
        'vds-can-play-through',
        'vds-controls-change',
        'vds-duration-change',
        'vds-emptied',
        'vds-ended',
        'vds-error',
        'vds-fullscreen-change',
        'vds-idle-change',
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
            .appendWithLabel('Event', event)
            .appendWithLabel('Engine', this.engine)
            .end();
        });

        this._disconnectDisposal.add(dispose);
      });
    }
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
  autoplay = false;

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
    return this.canPlay ? this._getVolume() : 1;
  }

  set volume(requestedVolume) {
    this.mediaRequestQueue.queue('volume', () => {
      const volume = clampNumber(0, requestedVolume, 1);

      if (DEV_MODE) {
        this._logger.info('setting `volume` to', volume);
      }

      this._setVolume(volume);
    });
  }

  protected abstract _getVolume(): number;
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
    return this.canPlay ? this._getPaused() : true;
  }

  set paused(shouldPause) {
    this.mediaRequestQueue.queue('paused', () => {
      if (!shouldPause) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  protected abstract _getPaused(): boolean;

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
    return this.canPlay ? this._getCurrentTime() : 0;
  }

  set currentTime(requestedTime) {
    this.mediaRequestQueue.queue('time', () => {
      if (DEV_MODE) {
        this._logger.info('setting `currentTime` to', requestedTime);
      }

      this._setCurrentTime(requestedTime);
    });
  }

  protected abstract _getCurrentTime(): number;
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
    return this.canPlay ? this._getMuted() : false;
  }

  set muted(shouldMute) {
    this.mediaRequestQueue.queue('muted', () => {
      if (DEV_MODE) {
        this._logger.info('setting `muted` to', shouldMute);
      }

      this._setMuted(shouldMute);
    });
  }

  protected abstract _getMuted(): boolean;
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
   * An immutable snapshot of the current media state.
   */
  get mediaState(): Readonly<ExtractContextRecordTypes<typeof mediaContext>> {
    return cloneMediaContextRecord(this.ctx);
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
    return this.ctx.buffered;
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
    return this.ctx.canPlay;
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
    return this.ctx.canPlayThrough;
  }

  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   *
   * @default ''
   */
  get currentPoster() {
    return this.ctx.currentPoster;
  }

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @default ''
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
   */
  get currentSrc() {
    return this.ctx.currentSrc;
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
    return this.ctx.duration;
  }

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
   */
  get ended() {
    return this.ctx.ended;
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
    return this.ctx.error;
  }

  /**
   * Whether the current media is a live stream.
   *
   * @default false
   */
  get live() {
    return this.ctx.live;
  }

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @default MediaType.Unknown
   */
  get mediaType() {
    return this.ctx.mediaType;
  }

  /**
   * Contains the ranges of the media source that the browser has played, if any.
   *
   * @default TimeRanges
   */
  get played() {
    return this.ctx.played;
  }

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @default false
   */
  get playing() {
    return this.ctx.playing;
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
    return this.ctx.seekable;
  }

  /**
   * Whether media is actively seeking to an new playback position.
   *
   * @default false
   */
  get seeking() {
    return this.ctx.seeking;
  }

  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @default false
   */
  get started() {
    return this.ctx.started;
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
    return this.ctx.viewType;
  }

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @default false
   */
  get waiting() {
    return this.ctx.waiting;
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

  protected _hasPlaybackRoughlyEnded(): boolean {
    if (isNaN(this.duration) || this.duration === 0) return false;
    return (
      Math.abs(
        Math.round(this.duration * 10) - Math.round(this.currentTime * 10)
      ) <= 1
    );
  }

  /**
   * Call if you suspect that playback might have resumed/ended again.
   */
  protected _validatePlaybackEndedState(): void {
    if (this.ctx.ended && !this._hasPlaybackRoughlyEnded()) {
      if (DEV_MODE) {
        this._logger
          .infoGroup('invalid ended state')
          .appendWithLabel('Duration', this.duration)
          .end();
      }

      this.ctx.ended = false;
    } else if (!this.ctx.ended && this._hasPlaybackRoughlyEnded()) {
      if (DEV_MODE) {
        this._logger
          .infoGroup('playback has roughly ended')
          .appendWithLabel('Duration', this.duration)
          .end();
      }

      this.ctx.waiting = false;
      this.dispatchEvent(vdsEvent('vds-suspend'));
      this.ctx.ended = true;
      this.dispatchEvent(vdsEvent('vds-error'));
    }
  }

  protected async _resetPlayback(): Promise<void> {
    this._setCurrentTime(0);
  }

  protected async _resetPlaybackIfEnded(): Promise<void> {
    if (!this._hasPlaybackRoughlyEnded()) return;
    return this._resetPlayback();
  }

  /**
   * @throws {Error} - Will throw if player is not in a video view.
   */
  protected _throwIfNotVideoView() {
    if (!this.ctx.isVideoView) {
      throw Error('Player is currently not in a video view.');
    }
  }

  protected async _handleMediaReady(event?: Event) {
    this.ctx.canPlay = true;

    this.dispatchEvent(vdsEvent('vds-can-play', { originalEvent: event }));

    await this.mediaRequestQueue.flush();
    this.mediaRequestQueue.serveImmediately = true;

    if (DEV_MODE) {
      this._logger
        .infoGroup(
          '-------------------------- ✅ MEDIA READY -----------------------------------'
        )
        .appendWithLabel('Context', this.mediaState)
        .appendWithLabel('Event', event)
        .appendWithLabel('Engine', this.engine)
        .end();
    }

    this._attemptAutoplay();
  }

  protected _autoplayRetryCount = 0;
  protected _maxAutoplayRetries = 3;
  protected _shouldMuteLastAutoplayAttempt = true;

  protected async _attemptAutoplay() {
    if (!this.canPlay || !this.autoplay || this.started) return;

    // On last attempt try muted.
    const shouldTryMuted =
      !this.muted &&
      this._shouldMuteLastAutoplayAttempt &&
      this._autoplayRetryCount === this._maxAutoplayRetries - 1;

    if (DEV_MODE && this._autoplayRetryCount > 0) {
      this._logger
        .warnGroup(
          `Seems like autoplay has failed, retrying [attempt ${
            this._autoplayRetryCount
          }]${shouldTryMuted ? ' muted' : ''}...`
        )
        .appendWithLabel('Engine', this.engine)
        .end();
    }

    let didAttemptSucceed = false;

    try {
      if (shouldTryMuted) this.muted = true;
      await this.play();
      didAttemptSucceed = true;

      if (DEV_MODE) {
        this._logger.info('✅ Autoplay was successful.');
      }
    } catch (e) {
      if (DEV_MODE) {
        this._logger
          .errorGroup(
            `Autoplay retry [attempt ${this._autoplayRetryCount}] failed.`
          )
          .appendWithLabel('Engine', this.engine)
          .appendWithLabel('Error', e)
          .end();
      }
    }

    const shouldTryAgain =
      !didAttemptSucceed && this._autoplayRetryCount < this._maxAutoplayRetries;

    if (shouldTryAgain) {
      this._autoplayRetryCount += 1;
      return this._attemptAutoplay();
    } else {
      // Give up.
      this._autoplayRetryCount = 0;
    }
  }

  protected _shouldSkipNextSrcChangeReset = true;

  protected _handleMediaSrcChange() {
    if (!this.hasUpdated) return;

    // Skip first flush to ensure initial properties set make it to the provider.
    if (this._shouldSkipNextSrcChangeReset) {
      this._shouldSkipNextSrcChangeReset = false;
      return;
    }

    if (DEV_MODE) {
      this._logger
        .infoGroup('📼 media src change')
        .appendWithLabel('Current src', this.currentSrc)
        .appendWithLabel('Engine', this.engine)
        .end();
    }

    this.mediaRequestQueue.serveImmediately = false;
    this._softResetMediaContext();
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
   * @internal
   */
  readonly ctx = createMediaContextRecord();

  /**
   * Media context properties that should be reset when media is changed. Override this
   * to include additional properties.
   */
  protected _getMediaPropsToResetWhenSrcChanges(): Set<string> {
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
   */
  protected _softResetMediaContext() {
    const propsToReset = this._getMediaPropsToResetWhenSrcChanges();

    if (DEV_MODE) {
      this._logger
        .infoGroup('soft context reset')
        .appendWithLabel('Engine', this.engine)
        .appendWithLabel('Context', this.mediaState)
        .appendWithLabel('Reset props', propsToReset)
        .end();
    }

    Object.keys(mediaContext).forEach((prop) => {
      if (propsToReset.has(prop)) {
        this.ctx[prop] = mediaContext[prop].initialValue;
      }
    });
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be applied safely after the element has connected to the DOM.
   */
  readonly _connectedQueue = new RequestQueue(
    this,
    DEV_MODE && { name: 'connectedQueue', owner: this }
  );

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback, marked
   * by the `canPlay` property. If the media provider is ready, actions will be invoked immediately.
   */
  readonly mediaRequestQueue = new RequestQueue(
    this,
    DEV_MODE && { name: 'mediaRequestQueue', owner: this }
  );

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
    return this.ctx.fullscreen;
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

  @eventListener('vds-fullscreen-change')
  protected _handleFullscreenChange(event: FullscreenChangeEvent) {
    if (DEV_MODE) {
      this._logger
        .infoGroup('fullscreen change')
        .appendWithLabel('Event', event)
        .appendWithLabel('Engine', this.engine)
        .end();
    }

    this.ctx.fullscreen = event.detail;
  }
}
