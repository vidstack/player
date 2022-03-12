import {
  appendTriggerEvent,
  debounce,
  DisposalBin,
  eventListener,
  isNil,
  keysOf,
  LogController,
  LogDispatcher,
  RequestQueue,
  setAttribute,
  throttle,
  vdsEvent,
  WritableStore,
} from '@vidstack/foundation';
import type { ReactiveElement } from 'lit';

import { VdsMediaEvent } from '../events.js';
import { MediaProviderElement } from '../provider/MediaProviderElement.js';
import { PendingMediaRequests } from '../request.events.js';
import { mediaStoreContext, ReadableMediaStoreRecord, WritableMediaStoreRecord } from '../store.js';
import { MediaIdleController } from './MediaIdleController.js';

export type MediaControllerHost = ReactiveElement & {
  exitFullscreen?(): Promise<void>;
};

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components and plugins. The main responsibilities are:
 *
 * - Provide the media store context that is used to pass media state down to components.
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * - Listen for media events and update the media store.
 */
export class MediaController {
  protected readonly _disconnectDisposal = new DisposalBin();
  protected readonly _mediaProviderConnectedQueue = new RequestQueue();
  protected readonly _mediaProviderDisconnectedDisposal = new DisposalBin();

  constructor(protected readonly _host: MediaControllerHost) {
    _host.addController({
      hostDisconnected: () => {
        this._clearMediaStateTracking();
        this._clearPendingMediaRequests();
        this._mediaProviderConnectedQueue.destroy();
        this._mediaProviderDisconnectedDisposal.empty();
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

  protected _mediaProvider: MediaProviderElement | undefined;

  get mediaProvider() {
    return this._mediaProvider;
  }

  protected _handleMediaProviderConnect = eventListener(
    this._host,
    'vds-media-provider-connect',
    (event) => {
      // @ts-expect-error - not typed.
      if (event.detail.connected) return;

      const { element, onDisconnect } = event.detail;

      // @ts-expect-error - not typed.
      event.detail.connected = true;

      if (this.mediaProvider === element) return;

      this._handleMediaProviderDisconnect();
      this._mediaProvider = element;
      this._flushMediaProviderConnectedQueue();
      onDisconnect(this._handleMediaProviderDisconnect.bind(this));
    },
  );

  protected _handleMediaProviderDisconnect() {
    if (isNil(this.mediaProvider)) return;
    this._mediaProviderConnectedQueue.destroy();
    this._mediaProviderDisconnectedDisposal.empty();
    this._mediaProvider = undefined;
    this._store.canLoad.set(false);
  }

  protected _flushMediaProviderConnectedQueue() {
    this._mediaProviderConnectedQueue.start();
    this._mediaProviderDisconnectedDisposal.add(() => {
      this._mediaProviderConnectedQueue.stop();
    });
  }

  protected _setProviderAttr(name: string, value: string | boolean | null) {
    this._mediaProviderConnectedQueue.queue(`attr:${name}`, () => {
      if (this.mediaProvider) {
        setAttribute(this._mediaProvider!, name, value);
      }
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

  // -------------------------------------------------------------------------------------------
  // Media Idle Controller
  // -------------------------------------------------------------------------------------------

  protected _mediaIdleController = new MediaIdleController(this._host, this._store);

  get idleDelay() {
    return this._mediaIdleController.delay;
  }

  set idleDelay(delay) {
    this._mediaIdleController.delay = delay;
  }

  protected _handleIdleChange = eventListener(this._host, 'vds-idle-change', (event) => {
    this._store.idle.set(event.detail);
    this._satisfyMediaRequest('idle', event);
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
    idle: [],
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
   *
   * @param event
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
    return async (event: E) => {
      if (!this._mediaRequestEventGateway(event)) return;

      if (this._mediaProvider) {
        await callback(event);
        return;
      }

      this._mediaProviderConnectedQueue.queue(queueKey, async () => {
        await callback(event);
      });
    };
  }

  protected _handleCanLoad = eventListener(this._host, 'vds-can-load', () => {
    this._store.canLoad.set(true);
  });

  protected _handleMuteRequest = eventListener(
    this._host,
    'vds-mute-request',
    this._createMediaRequestHandler('muted', (event) => {
      if (this._mediaProvider?.muted === true) return;
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.muted = true;
    }),
  );

  protected readonly _handleUnmuteRequest = eventListener(
    this._host,
    'vds-unmute-request',
    this._createMediaRequestHandler('muted', (event) => {
      if (this._mediaProvider?.muted === false) return;
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.muted = false;
    }),
  );

  protected readonly _handlePlayRequest = eventListener(
    this._host,
    'vds-play-request',
    this._createMediaRequestHandler('paused', (event) => {
      if (this._mediaProvider?.paused === false) return;
      this._pendingMediaRequests.play.push(event);
      this.mediaProvider!.paused = false;
    }),
  );

  protected readonly _handlePauseRequest = eventListener(
    this._host,
    'vds-pause-request',
    this._createMediaRequestHandler('paused', (event) => {
      if (this._mediaProvider?.paused === true) return;
      this._pendingMediaRequests.pause.push(event);
      this.mediaProvider!.paused = true;
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
      if (this._mediaProvider?.ended) {
        this._isReplay = true;
      }

      this._pendingMediaRequests.seeked.push(event);
      this._isSeekingRequestPending = false;

      let time = event.detail;

      // Snap to end if close enough.
      if (this.mediaProvider!.duration - event.detail < 0.25) {
        time = this.mediaProvider!.duration;
      }

      this.mediaProvider!.currentTime = time;
    }),
  );

  protected readonly _handleVolumeChangeRequest = eventListener(
    this._host,
    'vds-volume-change-request',
    this._createMediaRequestHandler('volume', (event) => {
      if (this._mediaProvider?.volume === event.detail) return;
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.volume = event.detail;
    }),
  );

  protected readonly _handleEnterFullscreenRequest = eventListener(
    this._host,
    'vds-enter-fullscreen-request',
    this._createMediaRequestHandler('fullscreen', async (event) => {
      if (this.mediaProvider?.fullscreen) return;
      this._pendingMediaRequests.fullscreen.push(event);
      await this._host.requestFullscreen();
    }),
  );

  protected readonly _handleExitFullscreenRequest = eventListener(
    this._host,
    'vds-exit-fullscreen-request',
    this._createMediaRequestHandler('fullscreen', async (event) => {
      if (!this.mediaProvider?.fullscreen) return;
      this._pendingMediaRequests.fullscreen.push(event);
      await this._host.exitFullscreen?.();
    }),
  );

  protected readonly _handleResumeIdlingRequest = eventListener(
    this._host,
    'vds-resume-idling-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._pendingMediaRequests.idle.push(event);
      this._mediaIdleController.paused = false;
    },
  );

  protected readonly _handlePauseIdlingRequest = eventListener(
    this._host,
    'vds-pause-idling-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._pendingMediaRequests.idle.push(event);
      this._mediaIdleController.paused = true;
    },
  );

  protected readonly _handleShowPosterRequest = eventListener(
    this._host,
    'vds-show-poster-request',
    this._createMediaRequestHandler('poster', () => {
      this._mediaProvider!.__canLoadPoster = true;
    }),
  );

  protected readonly _handleHidePosterRequest = eventListener(
    this._host,
    'vds-hide-poster-request',
    this._createMediaRequestHandler('poster', () => {
      this._mediaProvider!.__canLoadPoster = false;
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
          await this._mediaProvider!.play();
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

  protected readonly _handleLoadStart = eventListener(this._host, 'vds-load-start', (event) => {
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-src-change'));
    this._store.currentSrc.set(event.detail.src);
    this._store.currentPoster.set(event.detail.poster);
    this._store.mediaType.set(event.detail.mediaType);
    this._store.viewType.set(event.detail.viewType);
  });

  protected readonly _handleLoadedData = eventListener(this._host, 'vds-loaded-data', (event) => {
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-load-start'));
  });

  protected readonly _handleLoadedMetadata = eventListener(
    this._host,
    'vds-loaded-metadata',
    (event) => {
      this._mediaEvents.push(event);
      appendTriggerEvent(event, this._findLastMediaEvent('vds-load-start'));
    },
  );

  protected readonly _handleCanPlay = eventListener(this._host, 'vds-can-play', (event) => {
    this._mediaEvents.push(event);

    // Avoid infinite chain - `hls.js` will not fire `canplay` event.
    if (event.triggerEvent?.type !== 'loadedmetadata') {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-loaded-metadata'));
    }

    this._store.canPlay.set(true);
    this._store.duration.set(event.detail.duration);
  });

  protected readonly _handleCanPlayThrough = eventListener(
    this._host,
    'vds-can-play-through',
    (event) => {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
    },
  );

  protected readonly _handleAutoplay = eventListener(this._host, 'vds-autoplay', (event) => {
    this._mediaEvents.push(event);
    appendTriggerEvent(event, this._findLastMediaEvent('vds-play'));
    appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
    this._store.autoplayError.set(undefined);
  });

  protected readonly _handleAutoplayFail = eventListener(
    this._host,
    'vds-autoplay-fail',
    (event) => {
      appendTriggerEvent(event, this._findLastMediaEvent('vds-play-fail'));
      appendTriggerEvent(event, this._findLastMediaEvent('vds-can-play'));
      this._store.autoplayError.set(event.detail);
      this._clearMediaStateTracking();
    },
  );

  protected readonly _handlePlay = eventListener(this._host, 'vds-play', (event) => {
    if (this._isLooping || !this._mediaProvider?.paused) {
      event.stopImmediatePropagation();
      return;
    }

    this._mediaEvents.push(event);

    appendTriggerEvent(event, this._findLastMediaEvent('vds-waiting'));

    this._satisfyMediaRequest('play', event);

    this._store.paused.set(false);
    this._store.autoplayError.set(undefined);

    this._setProviderAttr('paused', false);

    if (this._mediaProvider?.ended || this._isReplay) {
      this._isReplay = false;
      this._store.ended.set(false);
      const replayEvent = vdsEvent('vds-replay', {
        triggerEvent: event,
      });
      this._mediaProvider?.dispatchEvent(replayEvent);
    }
  });

  protected readonly _handlePlayFail = eventListener(this._host, 'vds-play-fail', (event) => {
    this._mediaEvents.push(event);

    this._stopWaiting();

    appendTriggerEvent(event, this._findLastMediaEvent('vds-play'));

    this._store.paused.set(true);
    this._store.playing.set(false);

    this._satisfyMediaRequest('play', event);

    this._clearMediaStateTracking();
  });

  protected readonly _handlePlaying = eventListener(this._host, 'vds-playing', (event) => {
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

    if (!this._mediaProvider?.started) {
      this._store.started.set(true);
      this._mediaProvider?.dispatchEvent(vdsEvent('vds-started', { triggerEvent: event }));
    }
  });

  protected readonly _handlePause = eventListener(this._host, 'vds-pause', (event) => {
    if (this._isLooping) {
      event.stopImmediatePropagation();
      return;
    }

    appendTriggerEvent(event, this._findLastMediaEvent('vds-seeked'));
    this._satisfyMediaRequest('pause', event);

    this._store.paused.set(true);
    this._store.playing.set(false);
    this._store.seeking.set(false);

    this._setProviderAttr('paused', true);

    this._stopWaiting();
    this._clearMediaStateTracking();
  });

  protected readonly _handleTimeUpdate = eventListener(this._host, 'vds-time-update', (event) => {
    this._store.currentTime.set(event.detail);
    this._store.waiting.set(false);
  });

  protected readonly _handleVolumeChange = eventListener(
    this._host,
    'vds-volume-change',
    (event) => {
      this._store.volume.set(event.detail.volume);
      this._store.muted.set(event.detail.muted);
      this._satisfyMediaRequest('volume', event);
      this._setProviderAttr('muted', event.detail.muted);
    },
  );

  protected readonly _handleSeeking = eventListener(
    this._host,
    'vds-seeking',
    throttle(
      (event) => {
        this._mediaEvents.push(event);
        this._store.seeking.set(true);
        this._store.currentTime.set(event.detail);
        this._satisfyMediaRequest('seeking', event);
      },
      150,
      { leading: true },
    ),
  );

  protected readonly _handleSeeked = eventListener(this._host, 'vds-seeked', (event) => {
    // We don't want `seeked` events firing while seeking is updating media playback position.
    if (this._isSeekingRequestPending) {
      this._store.seeking.set(true);
      event.stopImmediatePropagation();
    } else if (this._mediaProvider?.seeking) {
      this._mediaEvents.push(event);

      appendTriggerEvent(event, this._findLastMediaEvent('vds-waiting'));
      appendTriggerEvent(event, this._findLastMediaEvent('vds-seeking'));

      if (this._mediaProvider.paused) {
        this._stopWaiting();
      }

      this._store.seeking.set(false);

      if (event.detail !== this._mediaProvider.duration) {
        this._store.ended.set(false);
      }

      this._store.currentTime.set(event.detail);
      this._satisfyMediaRequest('seeked', event);
    }
  });

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
    this._mediaProvider?.dispatchEvent(event);
    this._originalWaitingEvent = undefined;

    this._firingWaiting = false;
  }, 300);

  protected readonly _handleWaiting = eventListener(this._host, 'vds-waiting', (event) => {
    if (this._firingWaiting) return;
    event.stopImmediatePropagation();
    this._originalWaitingEvent = event;
    this._fireWaiting();
  });

  protected readonly _handleEnded = eventListener(this._host, 'vds-ended', (event) => {
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
  });

  protected readonly _handleAutoplayChange = eventListener(
    this._host,
    'vds-autoplay-change',
    (event) => {
      this._store.autoplay.set(event.detail);
    },
  );

  protected readonly _handleError = eventListener(this._host, 'vds-error', (event) => {
    this._store.error.set(event.detail);
  });

  protected readonly _handleFullscreenSupportChange = eventListener(
    this._host,
    'vds-fullscreen-support-change',
    (event) => {
      this._store.canFullscreen.set(event.detail);
    },
  );

  protected readonly _handlePosterChange = eventListener(
    this._host,
    'vds-poster-change',
    (event) => {
      this._store.currentPoster.set(event.detail);
      this._setProviderAttr('poster', event.detail);
    },
  );

  protected readonly _handleLoopChange = eventListener(this._host, 'vds-loop-change', (event) => {
    this._store.loop.set(event.detail);
  });

  protected readonly _handlePlaysinlineChange = eventListener(
    this._host,
    'vds-playsinline-change',
    (event) => {
      this._store.playsinline.set(event.detail);
    },
  );

  protected readonly _handleControlsChange = eventListener(
    this._host,
    'vds-controls-change',
    (event) => {
      this._store.controls.set(event.detail);
    },
  );

  protected readonly _handleMediaTypeChange = eventListener(
    this._host,
    'vds-media-type-change',
    (event) => {
      this._store.mediaType.set(event.detail);
    },
  );

  protected readonly _handleDurationChange = eventListener(
    this._host,
    'vds-duration-change',
    (event) => {
      this._store.duration.set(event.detail);
    },
  );

  protected readonly _handleProgress = eventListener(this._host, 'vds-progress', (event) => {
    const { buffered, seekable } = event.detail;
    const bufferedAmount = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
    const seekableAmount = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
    this._store.buffered.set(buffered);
    this._store.bufferedAmount.set(bufferedAmount);
    this._store.seekable.set(seekable);
    this._store.seekableAmount.set(seekableAmount);
  });

  protected readonly _handleSrcChange = eventListener(this._host, 'vds-src-change', (event) => {
    this._clearMediaStateTracking();
    this._mediaEvents.push(event);

    this._store.currentSrc.set(event.detail);
    this._setProviderAttr('src', event.detail);

    const dontReset = new Set<keyof WritableMediaStoreRecord>([
      'currentSrc',
      'autoplay',
      'canFullscreen',
      'controls',
      'canLoad',
      'loop',
      'muted',
      'playsinline',
      'viewType',
      'volume',
    ]);

    const store = this._store;
    keysOf(store).forEach((prop) => {
      if (!dontReset.has(prop)) {
        (store[prop] as WritableStore<unknown>).set(store[prop].initialValue);
      }
    });
  });
}
