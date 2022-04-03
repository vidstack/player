import {
  appendTriggerEvent,
  copyStoreRecords,
  debounce,
  type DisconnectCallback,
  discover,
  DisposalBin,
  eventListener,
  type FullscreenSupportChange,
  isNil,
  keysOf,
  listen,
  LogController,
  LogDispatcher,
  RequestQueue,
  throttle,
  unwrapStoreRecord,
  vdsEvent,
} from '@vidstack/foundation';
import { type ReactiveElement } from 'lit';

import type {
  MediaAutoplayChangeEvent,
  MediaAutoplayEvent,
  MediaAutoplayFailEvent,
  MediaCanPlayEvent,
  MediaCanPlayThroughEvent,
  MediaControlsChangeEvent,
  MediaCurrentSrcChangeEvent,
  MediaDurationChangeEvent,
  MediaEndedEvent,
  MediaErrorEvent,
  MediaLoadedDataEvent,
  MediaLoadedMetadataEvent,
  MediaLoadStartEvent,
  MediaLoopChangeEvent,
  MediaMetadataEventDetail,
  MediaPauseEvent,
  MediaPlayEvent,
  MediaPlayingEvent,
  MediaPlaysinlineChangeEvent,
  MediaPosterChangeEvent,
  MediaProgressEvent,
  MediaSeekedEvent,
  MediaSeekingEvent,
  MediaSrcChangeEvent,
  MediaTimeUpdateEvent,
  MediaTypeChangeEvent,
  MediaViewTypeChangeEvent,
  MediaVolumeChangeEvent,
  MediaWaitingEvent,
  VdsMediaEvent,
} from '../events';
import { mediaProviderElementContext } from '../provider';
import {
  mediaProviderDiscoveryId,
  type MediaProviderElement,
} from '../provider/MediaProviderElement';
import { type PendingMediaRequests } from '../request.events';
import {
  mediaStoreContext,
  type ReadableMediaStoreRecord,
  resetMediaStore,
  softResetMediaStore,
  type WritableMediaStoreRecord,
} from '../store';
import { ViewType } from '../ViewType';
import { UserIdleController } from './UserIdleController';

export type MediaControllerHost = ReactiveElement & {
  readonly canFullscreen: boolean;
  enterFullscreen?(): Promise<void>;
  exitFullscreen?(): Promise<void>;
};

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components and plugins. The controller's main responsibilities are:
 *
 * - Providing the media store context down to all child consumers (i.e., UI elements) so they can
 * subscribe to media state changes.
 *
 * - Listening for media request events so it can try and satisfy them (e.g., accepting a play
 * request and satisfying it by calling play on the media provider).
 *
 * - Listening to media events and updating state in the media store.
 */
export class MediaController {
  protected readonly _disconnectDisposal = new DisposalBin();

  /**
   * Queue actions to be invoked after the provider has connected to the media controller.
   */
  readonly providerQueue = new RequestQueue();

  /**
   * Queue actions to be invoked after the provider has detached from the media controller.
   */
  readonly providerDisposal = new DisposalBin();

  constructor(protected readonly _host: MediaControllerHost) {
    discover(_host, mediaProviderDiscoveryId, (provider, onDisconnect) => {
      this.attachMediaProvider(provider as MediaProviderElement, onDisconnect);
    });

    _host.addController({
      hostDisconnected: () => {
        this._clearMediaStateTracking();
        this._clearPendingMediaRequests();
        this.providerQueue.destroy();
        this.providerDisposal.empty();
        this._skipInitialSrcChange = true;
        this._disconnectDisposal.empty();
      },
    });
  }

  // -------------------------------------------------------------------------------------------
  // Logger
  // -------------------------------------------------------------------------------------------

  protected readonly _logController = __DEV__ ? new LogController(this._host) : undefined;

  protected readonly _logger = __DEV__ ? new LogDispatcher(this._host) : undefined;

  get logLevel() {
    return this._logController?.logLevel ?? 'silent';
  }

  set logLevel(level) {
    if (__DEV__) {
      this._logController!.logLevel = level;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  protected _provider: MediaProviderElement | undefined;

  protected readonly _providerContext = mediaProviderElementContext.provide(this._host);

  /**
   * The media provider that is attached this media controller.
   */
  get provider() {
    return this._provider;
  }

  /**
   * Attach a media provider to this media controller.
   */
  attachMediaProvider(provider: MediaProviderElement, onDisconnect: DisconnectCallback) {
    if (!isNil(this.provider) || this.provider === provider) return;

    // Clear any existing listeners.
    this._handleMediaProviderDisconnect();

    this._provider = provider;
    this._providerContext.value.set(provider);

    copyStoreRecords(this._provider._store, this._store);
    this._attachMediaEventListeners();

    provider.attachMediaController(this, (cb) => this._disconnectDisposal.add(cb));

    this._flushMediaProviderConnectedQueue();

    onDisconnect(this._handleMediaProviderDisconnect.bind(this));
  }

  protected _handleMediaProviderDisconnect() {
    if (isNil(this.provider)) return;
    this.providerQueue.destroy();
    this.providerDisposal.empty();
    this._provider = undefined;
    this._providerContext.value.set(undefined);
    resetMediaStore(this._store);
    this._store.viewType.set(ViewType.Unknown);
  }

  protected _flushMediaProviderConnectedQueue() {
    this.providerQueue.start();
    this.providerDisposal.add(() => {
      this.providerQueue.stop();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Store
  // -------------------------------------------------------------------------------------------

  private readonly _mediaStoreProvider = mediaStoreContext.provide(this._host);

  get store(): ReadableMediaStoreRecord {
    return this._mediaStoreProvider.value;
  }

  /** @internal */
  get _store(): WritableMediaStoreRecord {
    return this._mediaStoreProvider.value;
  }

  readonly state = unwrapStoreRecord(this._store);

  // -------------------------------------------------------------------------------------------
  // User Idle Controller
  // -------------------------------------------------------------------------------------------

  protected _userIdleController = new UserIdleController(this._host, this._store);

  get idleDelay() {
    return this._userIdleController.delay;
  }

  set idleDelay(delay) {
    this._userIdleController.delay = delay;
  }

  protected _handleIdleChange = eventListener(this._host, 'vds-user-idle-change', (event) => {
    this._store.userIdle.set(event.detail);
    this._satisfyMediaRequest('userIdle', event);
  });

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  /**
   * Media requests that have been made but are waiting to be satisfied. Key represents the media
   * event type the request is waiting for to be considered "satisfied".
   */
  protected _pendingMediaRequests: PendingMediaRequests = {
    play: [],
    pause: [],
    volume: [],
    fullscreen: [],
    seeked: [],
    seeking: [],
    userIdle: [],
  };

  protected _clearPendingMediaRequests(): void {
    keysOf(this._pendingMediaRequests).forEach((key) => {
      this._pendingMediaRequests[key] = [];
    });
  }

  protected _satisfyMediaRequest<T extends keyof PendingMediaRequests>(
    type: T,
    event: VdsMediaEvent<unknown>,
  ): void {
    const requestEvent = this._pendingMediaRequests[type].shift();
    if (requestEvent) {
      event.requestEvent = requestEvent;
      appendTriggerEvent(event, requestEvent);
    }
  }

  /**
   * Override this to allow media events to bubble up the DOM.
   */
  protected _mediaRequestEventGateway(event: Event) {
    event.stopPropagation();

    if (__DEV__) {
      this._logger
        ?.infoGroup(`📬 received \`${event.type}\``)
        .labelledLog('Request', event)
        .dispatch();
    }

    return true;
  }

  protected _createMediaRequestHandler<E extends Event>(
    queueKey: string,
    callback: (event: E) => void | Promise<void>,
  ) {
    return (event: E) => {
      if (!this._mediaRequestEventGateway(event)) return;

      if (this._provider) {
        callback(event);
        return;
      }

      this.providerQueue.queue(queueKey, () => {
        callback(event);
      });
    };
  }

  protected _handleMuteRequest = eventListener(
    this._host,
    'vds-mute-request',
    this._createMediaRequestHandler('muted', (event) => {
      if (this.state.muted) return;
      this._pendingMediaRequests.volume.push(event);
      this.provider!.muted = true;
    }),
  );

  protected readonly _handleUnmuteRequest = eventListener(
    this._host,
    'vds-unmute-request',
    this._createMediaRequestHandler('muted', (event) => {
      if (!this.state.muted) return;
      this._pendingMediaRequests.volume.push(event);
      this.provider!.muted = false;
    }),
  );

  protected readonly _handlePlayRequest = eventListener(
    this._host,
    'vds-play-request',
    this._createMediaRequestHandler('paused', (event) => {
      if (!this.state.paused) return;
      this._pendingMediaRequests.play.push(event);
      this.provider!.paused = false;
    }),
  );

  protected readonly _handlePauseRequest = eventListener(
    this._host,
    'vds-pause-request',
    this._createMediaRequestHandler('paused', (event) => {
      if (this.state.paused) return;
      this._pendingMediaRequests.pause.push(event);
      this.provider!.paused = true;
    }),
  );

  protected _isSeekingRequestPending = false;

  protected readonly _handleSeekingRequest = eventListener(
    this._host,
    'vds-seeking-request',
    this._createMediaRequestHandler('seeking', (event) => {
      this._stopWaiting();
      this._pendingMediaRequests.seeking.push(event);
      this._isSeekingRequestPending = true;
      this._store.seeking.set(true);
    }),
  );

  protected readonly _handleSeekRequest = eventListener(
    this._host,
    'vds-seek-request',
    this._createMediaRequestHandler('seeking', (event) => {
      if (this.store.ended) {
        this._isReplay = true;
      }

      this._pendingMediaRequests.seeked.push(event);
      this._isSeekingRequestPending = false;

      let time = event.detail;

      // Snap to end if close enough.
      if (this.state.duration - event.detail < 0.25) {
        time = this.state.duration;
      }

      this.provider!.currentTime = time;
    }),
  );

  protected readonly _handleVolumeChangeRequest = eventListener(
    this._host,
    'vds-volume-change-request',
    this._createMediaRequestHandler('volume', (event) => {
      if (this.state.volume === event.detail) return;
      this._pendingMediaRequests.volume.push(event);
      this.provider!.volume = event.detail;
    }),
  );

  protected readonly _handleEnterFullscreenRequest = eventListener(
    this._host,
    'vds-enter-fullscreen-request',
    this._createMediaRequestHandler('fullscreen', async (event) => {
      if (this.state.fullscreen) return;

      const target = event.detail ?? 'media';

      if (target === 'media' && this._host.canFullscreen) {
        this._pendingMediaRequests.fullscreen.push(event);
        await this._host.enterFullscreen?.();
      } else if (this.provider) {
        this._pendingMediaRequests.fullscreen.push(event);
        await this.provider.enterFullscreen();
      }
    }),
  );

  protected readonly _handleExitFullscreenRequest = eventListener(
    this._host,
    'vds-exit-fullscreen-request',
    this._createMediaRequestHandler('fullscreen', async (event) => {
      if (!this.state.fullscreen) return;

      const target = event.detail ?? 'media';

      if (target === 'media' && this._host.canFullscreen) {
        this._pendingMediaRequests.fullscreen.push(event);
        await this._host.exitFullscreen?.();
      } else if (this.provider) {
        this._pendingMediaRequests.fullscreen.push(event);
        await this.provider.exitFullscreen();
      }
    }),
  );

  protected readonly _handleResumeIdlingRequest = eventListener(
    this._host,
    'vds-resume-user-idle-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._pendingMediaRequests.userIdle.push(event);
      this._userIdleController.paused = false;
    },
  );

  protected readonly _handlePauseIdlingRequest = eventListener(
    this._host,
    'vds-pause-user-idle-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._pendingMediaRequests.userIdle.push(event);
      this._userIdleController.paused = true;
    },
  );

  protected readonly _handleShowPosterRequest = eventListener(
    this._host,
    'vds-show-poster-request',
    this._createMediaRequestHandler('poster', () => {
      this._provider!.canLoadPoster = true;
    }),
  );

  protected readonly _handleHidePosterRequest = eventListener(
    this._host,
    'vds-hide-poster-request',
    this._createMediaRequestHandler('poster', () => {
      this._provider!.canLoadPoster = false;
    }),
  );

  protected readonly _handleLoopRequest = eventListener(
    this._host,
    'vds-loop-request',
    this._createMediaRequestHandler('loop', () => {
      window.requestAnimationFrame(async () => {
        try {
          this._isLooping = true;
          this._isReplay = true;
          await this._provider!.play();
        } catch (e) {
          this._isReplay = false;
          this._isLooping = false;
        }
      });
    }),
  );

  // -------------------------------------------------------------------------------------------
  // Fullscreen Events
  // -------------------------------------------------------------------------------------------

  protected readonly _handleFullscreenChange = eventListener(
    this._host,
    'vds-fullscreen-change',
    (event) => {
      this._store.fullscreen.set(event.detail);
      // @ts-expect-error - not a media event.
      this._satisfyMediaRequest('fullscreen', event);
    },
  );

  protected readonly _handleFullscreenError = eventListener(
    this._host,
    'vds-fullscreen-error',
    (event) => {
      // @ts-expect-error - not a media event.
      this._satisfyMediaRequest('fullscreen', event);
    },
  );

  // -------------------------------------------------------------------------------------------
  // Media Events
  // -------------------------------------------------------------------------------------------

  protected _isReplay = false;
  protected _isLooping = false;
  protected _firingWaiting = false;
  protected _originalWaitingEvent?: Event;
  protected _mediaEvents: Event[] = [];

  protected _attachMediaEventListeners() {
    if (!this._provider) return;

    const mediaEventListeners = {
      'vds-can-load': this._handleCanLoad,
      'vds-load-start': this._handleLoadStart,
      'vds-loaded-data': this._handleLoadedData,
      'vds-loaded-metadata': this._handleLoadedMetadata,
      'vds-can-play': this._handleCanPlay,
      'vds-can-play-through': this._handleCanPlayThrough,
      'vds-current-src-change': this._handleCurrentSrcChange,
      'vds-autoplay': this._handleAutoplay,
      'vds-autoplay-fail': this._handleAutoplayFail,
      'vds-play': this._handlePlay,
      'vds-play-fail': this._handlePlayFail,
      'vds-playing': this._handlePlaying,
      'vds-pause': this._handlePause,
      'vds-time-update': this._handleTimeUpdate,
      'vds-volume-change': this._handleVolumeChange,
      'vds-seeking': this._handleSeeking,
      'vds-seeked': this._handleSeeked,
      'vds-waiting': this._handleWaiting,
      'vds-ended': this._handleEnded,
      'vds-autoplay-change': this._handleAutoplayChange,
      'vds-error': this._handleError,
      'vds-fullscreen-support-change': this._handleFullscreenSupportChange,
      'vds-poster-change': this._handlePosterChange,
      'vds-loop-change': this._handleLoopChange,
      'vds-playsinline-change': this._handlePlaysinlineChange,
      'vds-controls-change': this._handleControlsChange,
      'vds-media-type-change': this._handleMediaTypeChange,
      'vds-view-type-change': this._handleViewTypeChange,
      'vds-duration-change': this._handleDurationChange,
      'vds-progress': this._handleProgress,
      'vds-src-change': this._handleSrcChange,
    };

    for (const eventType of keysOf(mediaEventListeners)) {
      const handler = mediaEventListeners[eventType].bind(this);
      this.providerDisposal.add(listen(this._provider, eventType, handler));
    }
  }

  protected _clearMediaStateTracking() {
    this._isReplay = false;
    this._isLooping = false;
    this._firingWaiting = false;
    this._originalWaitingEvent = undefined;
    this._mediaEvents = [];
  }

  protected _findLastMediaEvent(eventType: keyof GlobalEventHandlersEventMap) {
    return this._mediaEvents[this._mediaEvents.map((e) => e.type).lastIndexOf(eventType)];
  }

  protected _handleCanLoad() {
    this._store.canLoad.set(true);
  }

  protected _updateMetadata(metadata: MediaMetadataEventDetail) {
    this._store.currentSrc.set(metadata.currentSrc);
    this._store.mediaType.set(metadata.mediaType);
    this._store.viewType.set(metadata.viewType);
  }

  protected _handleLoadStart(event: MediaLoadStartEvent) {
    this._updateMetadata(event.detail);
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-src-change'));
  }

  protected _handleLoadedData(event: MediaLoadedDataEvent) {
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-load-start'));
  }

  protected _handleLoadedMetadata(event: MediaLoadedMetadataEvent) {
    this._updateMetadata(event.detail);
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-load-start'));
  }

  protected _handleCanPlay(event: MediaCanPlayEvent) {
    this._mediaEvents.push(event);

    // Avoid infinite chain - `hls.js` will not fire `canplay` event.
    if (event.triggerEvent?.type !== 'loadedmetadata') {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-loaded-metadata'));
    }

    this._store.canPlay.set(true);
    this._store.duration.set(event.detail.duration);
  }

  protected _handleCanPlayThrough(event: MediaCanPlayThroughEvent) {
    this._store.canPlay.set(true);
    this._store.duration.set(event.detail.duration);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
  }

  protected _handleAutoplay(event: MediaAutoplayEvent) {
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-play'));
    appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
    this._store.autoplayError.set(undefined);
  }

  protected _handleAutoplayFail(event: MediaAutoplayFailEvent) {
    appendTriggerEvent(event, this._findLastMediaEvent('vds-play-fail'));
    appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
    this._store.autoplayError.set(event.detail);
    this._clearMediaStateTracking();
  }

  protected _handlePlay(event: MediaPlayEvent) {
    if (this._isLooping || !this.state.paused) {
      event.stopImmediatePropagation();
      return;
    }

    this._mediaEvents.push(event);

    appendTriggerEvent(event, this._findLastMediaEvent('vds-waiting'));

    this._satisfyMediaRequest('play', event);

    this._store.paused.set(false);
    this._store.autoplayError.set(undefined);

    if (this.state.ended || this._isReplay) {
      this._isReplay = false;
      this._store.ended.set(false);
      const replayEvent = vdsEvent('vds-replay', {
        triggerEvent: event,
      });
      this._provider?.dispatchEvent(replayEvent);
    }
  }

  protected _handlePlayFail(event: MediaPlayEvent) {
    this._mediaEvents.push(event);

    this._stopWaiting();

    appendTriggerEvent(event, this._findLastMediaEvent('vds-play'));

    this._store.paused.set(true);
    this._store.playing.set(false);

    this._satisfyMediaRequest('play', event);

    this._clearMediaStateTracking();
  }

  protected _handlePlaying(event: MediaPlayingEvent) {
    this._mediaEvents.push(event);

    const playEvent = this._findLastMediaEvent('vds-play');

    if (playEvent) {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-waiting'));
      appendTriggerEvent(event, playEvent);
    } else {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-seeked'));
    }

    this._stopWaiting();
    this._clearMediaStateTracking();

    this._store.paused.set(false);
    this._store.playing.set(true);
    this._store.seeking.set(false);
    this._store.ended.set(false);

    if (this._isLooping) {
      event.stopImmediatePropagation();
      this._isLooping = false;
      return;
    }

    if (!this.state.started) {
      this._store.started.set(true);
      this._provider?.dispatchEvent(vdsEvent('vds-started', { triggerEvent: event }));
    }
  }

  protected _handlePause(event: MediaPauseEvent) {
    if (this._isLooping) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, this._findLastMediaEvent('vds-seeked'));
    this._satisfyMediaRequest('pause', event);

    this._store.paused.set(true);
    this._store.playing.set(false);
    this._store.seeking.set(false);

    this._stopWaiting();
    this._clearMediaStateTracking();
  }

  protected _handleTimeUpdate(event: MediaTimeUpdateEvent) {
    const { currentTime, played } = event.detail;
    this._store.currentTime.set(currentTime);
    this._store.played.set(played);
    this._store.waiting.set(false);
  }

  protected _handleVolumeChange(event: MediaVolumeChangeEvent) {
    this._store.volume.set(event.detail.volume);
    this._store.muted.set(event.detail.muted);
    this._satisfyMediaRequest('volume', event);
  }

  protected readonly _handleSeeking = throttle(
    (event: MediaSeekingEvent) => {
      this._mediaEvents.push(event);
      this._store.seeking.set(true);
      this._store.currentTime.set(event.detail);
      this._satisfyMediaRequest('seeking', event);
    },
    150,
    { leading: true },
  );

  protected _handleSeeked(event: MediaSeekedEvent) {
    // We don't want `seeked` events firing while seeking is updating media playback position.
    if (this._isSeekingRequestPending) {
      this._store.seeking.set(true);
      event.stopImmediatePropagation();
    } else if (this.state.seeking) {
      this._mediaEvents.push(event);

      appendTriggerEvent(event, this._findLastMediaEvent('vds-waiting'));
      appendTriggerEvent(event, this._findLastMediaEvent('vds-seeking'));

      if (this.state.paused) {
        this._stopWaiting();
      }

      this._store.seeking.set(false);

      if (event.detail !== this.state.duration) {
        this._store.ended.set(false);
      }

      this._store.currentTime.set(event.detail);
      this._satisfyMediaRequest('seeked', event);
    }
  }

  protected _stopWaiting() {
    this._fireWaiting.cancel();
    this._store.waiting.set(false);
  }

  protected readonly _fireWaiting = debounce(() => {
    if (!this._originalWaitingEvent) return;

    this._firingWaiting = true;

    const event = vdsEvent('vds-waiting', this._originalWaitingEvent);
    this._mediaEvents.push(event);
    this._store.waiting.set(true);
    this._store.playing.set(false);
    this._provider?.dispatchEvent(event);
    this._originalWaitingEvent = undefined;

    this._firingWaiting = false;
  }, 300);

  protected _handleWaiting(event: MediaWaitingEvent) {
    if (this._firingWaiting) return;
    event.stopImmediatePropagation();
    this._originalWaitingEvent = event;
    this._fireWaiting();
  }

  protected _handleEnded(event: MediaEndedEvent) {
    if (this._isLooping) {
      event.stopImmediatePropagation();
      return;
    }

    this._stopWaiting();
    this._store.paused.set(true);
    this._store.playing.set(false);
    this._store.seeking.set(false);
    this._store.ended.set(true);
    this._clearMediaStateTracking();
  }

  protected _handleAutoplayChange(event: MediaAutoplayChangeEvent) {
    this._store.autoplay.set(event.detail);
  }

  protected _skipInitialSrcChange = true;
  protected _handleCurrentSrcChange(event: MediaCurrentSrcChangeEvent) {
    this._store.currentSrc.set(event.detail);

    // Skip resets before first playback to ensure initial properties set make it to the provider.
    if (this._skipInitialSrcChange) {
      this._skipInitialSrcChange = false;
      return;
    }

    this._clearMediaStateTracking();
    softResetMediaStore(this._store);
  }

  protected _handleError(event: MediaErrorEvent) {
    this._store.error.set(event.detail);
  }

  protected _handleFullscreenSupportChange(event: FullscreenSupportChange) {
    this._store.canFullscreen.set(event.detail);
  }

  protected _handlePosterChange(event: MediaPosterChangeEvent) {
    this._store.poster.set(event.detail);
  }

  protected _handleLoopChange(event: MediaLoopChangeEvent) {
    this._store.loop.set(event.detail);
  }

  protected _handlePlaysinlineChange(event: MediaPlaysinlineChangeEvent) {
    this._store.playsinline.set(event.detail);
  }

  protected _handleControlsChange(event: MediaControlsChangeEvent) {
    this._store.controls.set(event.detail);
  }

  protected _handleMediaTypeChange(event: MediaTypeChangeEvent) {
    this._store.mediaType.set(event.detail);
  }

  protected _handleDurationChange(event: MediaDurationChangeEvent) {
    this._store.duration.set(event.detail);
  }

  protected _handleProgress(event: MediaProgressEvent) {
    const { buffered, seekable } = event.detail;
    const bufferedAmount = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
    const seekableAmount = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
    this._store.buffered.set(buffered);
    this._store.bufferedAmount.set(bufferedAmount);
    this._store.seekable.set(seekable);
    this._store.seekableAmount.set(seekableAmount);
  }

  protected _handleSrcChange(event: MediaSrcChangeEvent) {
    this._store.src.set(event.detail);
  }

  protected _handleViewTypeChange(event: MediaViewTypeChangeEvent) {
    this._store.viewType.set(event.detail);
  }
}
