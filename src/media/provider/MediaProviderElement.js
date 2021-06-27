import { VdsElement } from '../../shared/elements/index.js';
import { FullscreenController } from '../../shared/fullscreen/index.js';
import { RequestQueue } from '../../shared/queue/index.js';
import {
  ScreenOrientationController,
  ScreenOrientationLock
} from '../../shared/screen-orientation/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../shared/storybook/index.js';
import { getAllObjectPropertyNames } from '../../utils/object.js';
import { CanPlay } from '../CanPlay.js';
import { createMediaContextRecord, mediaContext } from '../media.context.js';
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
} from '../media.events.js';
import { MediaPlugin } from '../plugin/index.js';
import { MediaProviderConnectEvent } from './events.js';

/** @typedef {import('./types').MediaProvider} IMediaProvider */

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 *
 * @implements {IMediaProvider}
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

    // Properties
    /** @type {boolean} */
    this.autoplay = false;
    /** @type {boolean} */
    this.controls = false;
    /** @type {boolean} */
    this.loop = false;
    /** @type {boolean} */
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
  }

  // -------------------------------------------------------------------------------------------
  // Discovery
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {void}
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
   * @returns {void}
   */
  setVolume(newVolume) {
    throw Error('Not implemented.');
  }

  // ---

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
   * @returns {void}
   */
  setCurrentTime(newTime) {
    throw Error('Not implemented.');
  }

  // ---

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
   * @returns {void}
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
   * @readonly
   * @type {unknown}
   */
  get engine() {
    throw Error('Not implemented.');
  }

  get buffered() {
    return this.context.buffered;
  }

  get canPlay() {
    return this.context.canPlay;
  }

  get canPlayThrough() {
    return this.context.canPlayThrough;
  }

  get currentPoster() {
    return this.context.currentPoster;
  }

  get currentSrc() {
    return this.context.currentSrc;
  }

  get duration() {
    return this.context.duration;
  }

  get ended() {
    return this.context.ended;
  }

  get error() {
    return this.context.error;
  }

  get mediaType() {
    return this.context.mediaType;
  }

  get played() {
    return this.context.played;
  }

  get playing() {
    return this.context.playing;
  }

  get seekable() {
    return this.context.seekable;
  }

  get seeking() {
    return this.context.seeking;
  }
  get started() {
    return this.context.started;
  }

  get viewType() {
    return this.context.viewType;
  }

  get waiting() {
    return this.context.waiting;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  /**
   * @abstract
   * @param {string} type
   * @returns {CanPlay}
   */
  canPlayType(type) {
    throw Error('Not implemented');
  }

  /**
   * @param {string} type
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
   * @abstract
   * @returns {Promise<void>}
   */
  async play() {}

  /**
   * @abstract
   * @returns {Promise<void>}
   */
  async pause() {}

  /**
   * @protected
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  handleMediaReady(event) {
    this.context.canPlay = true;
    this.dispatchEvent(new CanPlayEvent({ originalEvent: event }));
    this.mediaRequestQueue.flush();
    this.mediaRequestQueue.serveImmediately = true;
  }

  /**
   * @protected
   * @returns {void}
   */
  handleMediaSrcChange() {
    this.mediaRequestQueue.serveImmediately = false;
    this.mediaRequestQueue.reset();
    this.softResetMediaContext();
  }

  // -------------------------------------------------------------------------------------------
  // Plugin
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  mediaPlugin = new MediaPlugin(this, {
    bridgedAttributes: /** @type {any} */ (this.constructor).observedAttributes,
    bridgedProperties: Array.from(getAllObjectPropertyNames(this, VdsElement)),
    bridgedEvents: /** @type {any} */ (this.constructor).events
  });

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
   * @internal Exposed for testing.
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
   * @returns {void}
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

  get canRequestFullscreen() {
    return this.fullscreenController.isSupported;
  }

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
   * @returns {void}
   */
  addFullscreenController(controller) {
    controller.addEventListener('fullscreen-change', (event) => {
      const isFullscreen = event.detail;
      this.context.fullscreen = isFullscreen;
      this.dispatchEvent(
        new FullscreenChangeEvent({
          detail: isFullscreen,
          originalEvent: event
        })
      );
    });

    controller.addEventListener('error', (event) => {
      const error = event.detail;
      this.context.error = error;
      this.dispatchEvent(
        new ErrorEvent({
          detail: error,
          originalEvent: event
        })
      );
    });
  }
}

/**
 * @readonly
 * @type {import("./types").MediaProviderElementStorybookArgTypes}
 */
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
  onVdsAbort: storybookAction(AbortEvent.TYPE),
  onVdsCanPlay: storybookAction(CanPlayEvent.TYPE),
  onVdsCanPlayThrough: storybookAction(CanPlayThroughEvent.TYPE),
  onVdsDurationChange: storybookAction(DurationChangeEvent.TYPE),
  onVdsEmptied: storybookAction(EmptiedEvent.TYPE),
  onVdsEnded: storybookAction(EndedEvent.TYPE),
  onVdsError: storybookAction(ErrorEvent.TYPE),
  onVdsFullscreenChange: storybookAction(FullscreenChangeEvent.TYPE),
  onVdsLoadedData: storybookAction(LoadedDataEvent.TYPE),
  onVdsLoadedMetadata: storybookAction(LoadedMetadataEvent.TYPE),
  onVdsLoadStart: storybookAction(LoadStartEvent.TYPE),
  onVdsMediaTypeChange: storybookAction(MediaTypeChangeEvent.TYPE),
  onVdsPause: storybookAction(PauseEvent.TYPE),
  onVdsPlay: storybookAction(PlayEvent.TYPE),
  onVdsPlaying: storybookAction(PlayingEvent.TYPE),
  onVdsProgress: storybookAction(ProgressEvent.TYPE),
  onVdsReplay: storybookAction(ReplayEvent.TYPE),
  onVdsSeeked: storybookAction(SeekedEvent.TYPE),
  onVdsSeeking: storybookAction(SeekingEvent.TYPE),
  onVdsStalled: storybookAction(StalledEvent.TYPE),
  onVdsStarted: storybookAction(StartedEvent.TYPE),
  onVdsSuspend: storybookAction(SuspendEvent.TYPE),
  onVdsTimeUpdate: storybookAction(TimeUpdateEvent.TYPE),
  onVdsViewTypeChange: storybookAction(ViewTypeChangeEvent.TYPE),
  onVdsVolumeChange: storybookAction(VolumeChangeEvent.TYPE),
  onVdsWaiting: storybookAction(WaitingEvent.TYPE),
  // Media Provider Actions
  onVdsMediaProviderConnect: storybookAction(MediaProviderConnectEvent.TYPE)
};
