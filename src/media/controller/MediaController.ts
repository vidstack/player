import debounce from 'just-debounce-it';
import type { ReactiveElement } from 'lit';

import { DisposalBin, hostedEventListener, vdsEvent } from '../../base/events';
import { LogController, LogDispatcher } from '../../base/logger';
import { RequestQueue } from '../../base/queue';
import { get, WritableStore } from '../../base/stores';
import { keysOf } from '../../utils/object';
import { isNil } from '../../utils/unit';
import {
  mediaStoreContext,
  ReadableMediaStoreRecord,
  WritableMediaStoreRecord
} from '../mediaStore';
import { MediaProviderElement } from '../provider/MediaProviderElement';
import { PendingMediaRequests } from '../request.events';
import { MediaIdleController } from './MediaIdleController';

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
        this._clearPendingMediaRequests();
        this._mediaProviderConnectedQueue.destroy();
        this._mediaProviderDisconnectedDisposal.empty();
        this._disconnectDisposal.empty();
      }
    });
  }

  // -------------------------------------------------------------------------------------------
  // Logger
  // -------------------------------------------------------------------------------------------

  protected readonly _logController = __DEV__
    ? new LogController(this._host)
    : undefined;

  protected readonly _logger = __DEV__
    ? new LogDispatcher(this._host)
    : undefined;

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

  protected _handleMediaProviderConnect = hostedEventListener(
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
    }
  );

  protected _handleMediaProviderDisconnect() {
    if (isNil(this.mediaProvider)) return;
    this._mediaProviderConnectedQueue.destroy();
    this._mediaProviderDisconnectedDisposal.empty();
    this._mediaProvider = undefined;
  }

  protected _flushMediaProviderConnectedQueue() {
    this._mediaProviderConnectedQueue.start();
    this._mediaProviderDisconnectedDisposal.add(() => {
      this._mediaProviderConnectedQueue.stop();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Store
  // -------------------------------------------------------------------------------------------

  private readonly _mediaStoreProvider = mediaStoreContext.provide(this._host);

  get mediaStore(): ReadableMediaStoreRecord {
    return this._mediaStoreProvider.value;
  }

  /** @internal */
  get _mediaStore(): WritableMediaStoreRecord {
    return this._mediaStoreProvider.value;
  }

  // -------------------------------------------------------------------------------------------
  // Media Idle Controller
  // -------------------------------------------------------------------------------------------

  protected _mediaIdleController = new MediaIdleController(
    this._host,
    this._mediaStore
  );

  get idleDelay() {
    return this._mediaIdleController.delay;
  }

  set idleDelay(delay) {
    this._mediaIdleController.delay = delay;
  }

  protected _handleIdleChange = hostedEventListener(
    this._host,
    'vds-idle-change',
    (event) => {
      this._mediaStore.idle.set(event.detail);
    }
  );

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
    seeking: []
  };

  protected _clearPendingMediaRequests(): void {
    keysOf(this._pendingMediaRequests).forEach((key) => {
      this._pendingMediaRequests[key] = [];
    });
  }

  protected satisfyMediaRequest<T extends keyof PendingMediaRequests>(
    type: T,
    event: Event & { requestEvent?: Event }
  ): void {
    event.requestEvent = this._pendingMediaRequests[type].shift();
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

  protected _handleMuteRequest = hostedEventListener(
    this._host,
    'vds-mute-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('muted', () => {
        if (this._mediaProvider?.muted === true) return;
        this._pendingMediaRequests.volume.push(event);
        this.mediaProvider!.muted = true;
      });
    }
  );

  protected readonly _handleUnmuteRequest = hostedEventListener(
    this._host,
    'vds-unmute-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('muted', () => {
        if (this._mediaProvider?.muted === false) return;
        this._pendingMediaRequests.volume.push(event);
        this.mediaProvider!.muted = false;
      });
    }
  );

  protected readonly _handlePlayRequest = hostedEventListener(
    this._host,
    'vds-play-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('paused', () => {
        if (this._mediaProvider?.paused === false) return;
        this._pendingMediaRequests.play.push(event);
        this.mediaProvider!.paused = false;
      });
    }
  );

  protected readonly _handlePauseRequest = hostedEventListener(
    this._host,
    'vds-pause-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('paused', () => {
        if (this._mediaProvider?.paused === true) return;
        this._pendingMediaRequests.pause.push(event);
        this.mediaProvider!.paused = true;
      });
    }
  );

  protected _isSeekingRequestPending = false;

  protected readonly _handleSeekingRequest = hostedEventListener(
    this._host,
    'vds-seeking-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('seeking', () => {
        this._pendingMediaRequests.seeking.push(event);
        this._isSeekingRequestPending = true;
        this._fireWaiting.cancel();
        this._mediaStore.seeking.set(true);
      });
    }
  );

  protected readonly _handleSeekRequest = hostedEventListener(
    this._host,
    'vds-seek-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('seeking', () => {
        this._pendingMediaRequests.seeked.push(event);
        this._isSeekingRequestPending = false;

        let time = event.detail;

        // Snap to end if close enough.
        if (this.mediaProvider!.duration - event.detail < 0.25) {
          time = this.mediaProvider!.duration;
        }

        this.mediaProvider!.currentTime = time;
      });
    }
  );

  protected readonly _handleVolumeChangeRequest = hostedEventListener(
    this._host,
    'vds-volume-change-request',
    (event) => {
      if (!this._mediaRequestEventGateway(event)) return;
      this._mediaProviderConnectedQueue.queue('volume', () => {
        if (this._mediaProvider?.volume === event.detail) return;
        this._pendingMediaRequests.volume.push(event);
        this.mediaProvider!.volume = event.detail;
      });
    }
  );

  protected readonly _handleEnterFullscreenRequest = hostedEventListener(
    this._host,
    'vds-enter-fullscreen-request',
    async (event) => {
      if (
        !this._mediaRequestEventGateway(event) ||
        this._mediaProvider?.fullscreen
      ) {
        return;
      }

      this._pendingMediaRequests.fullscreen.push(event);
      await this._host.requestFullscreen();
    }
  );

  protected readonly _handleExitFullscreenRequest = hostedEventListener(
    this._host,
    'vds-exit-fullscreen-request',
    async (event) => {
      if (
        !this._mediaRequestEventGateway(event) ||
        !this._mediaProvider?.fullscreen
      ) {
        return;
      }

      this._pendingMediaRequests.fullscreen.push(event);
      await this._host.exitFullscreen?.();
    }
  );

  protected readonly _handleFullscreenChange = hostedEventListener(
    this._host,
    'vds-fullscreen-change',
    (event) => {
      this._mediaStore.fullscreen.set(event.detail);
      this.satisfyMediaRequest('fullscreen', event);
    }
  );

  protected readonly _handleFullscreenError = hostedEventListener(
    this._host,
    'vds-fullscreen-error',
    (event) => {
      this._mediaStore.error.set(event.detail);
      this.satisfyMediaRequest('fullscreen', event);
    }
  );

  // -------------------------------------------------------------------------------------------
  // Media Events
  // -------------------------------------------------------------------------------------------

  protected readonly _handleLoadStart = hostedEventListener(
    this._host,
    'vds-load-start',
    (event) => {
      this._mediaStore.currentSrc.set(event.detail.src);
      this._mediaStore.currentPoster.set(event.detail.poster);
      this._mediaStore.mediaType.set(event.detail.mediaType);
      this._mediaStore.viewType.set(event.detail.viewType);
    }
  );

  protected readonly _handleAutoplay = hostedEventListener(
    this._host,
    'vds-autoplay',
    () => {
      this._mediaStore.autoplayError.set(undefined);
    }
  );

  protected readonly _handleAutoplayError = hostedEventListener(
    this._host,
    'vds-autoplay-fail',
    (event) => {
      this._mediaStore.autoplayError.set(event.detail);
    }
  );

  protected readonly _handleCanPlay = hostedEventListener(
    this._host,
    'vds-can-play',
    (event) => {
      this._mediaStore.canPlay.set(true);
      this._mediaStore.duration.set(event.detail.duration);
    }
  );

  protected readonly _handlePlay = hostedEventListener(
    this._host,
    'vds-play',
    (event) => {
      this._mediaStore.paused.set(false);
      this.satisfyMediaRequest('play', event);
    }
  );

  protected readonly _handlePlayFail = hostedEventListener(
    this._host,
    'vds-play-fail',
    (event) => {
      this._mediaStore.paused.set(true);
      this._mediaStore.playing.set(false);
      this._mediaStore.waiting.set(false);
      this._mediaStore.error.set(event.error);
      this.satisfyMediaRequest('play', event);
    }
  );

  protected readonly _handlePlaying = hostedEventListener(
    this._host,
    'vds-playing',
    (event) => {
      this._fireWaiting.cancel();

      this._mediaStore.paused.set(false);
      this._mediaStore.playing.set(true);
      this._mediaStore.waiting.set(false);
      this._mediaStore.seeking.set(false);

      if (!get(this._mediaStore.started)) {
        this._mediaStore.started.set(true);
      }

      if (this._isSeekingRequestPending) {
        event.stopImmediatePropagation();
        this._mediaStore.seeking.set(true);
      }
    }
  );

  protected readonly _handlePause = hostedEventListener(
    this._host,
    'vds-pause',
    (event) => {
      this._mediaStore.paused.set(true);
      this._mediaStore.playing.set(false);
      this._mediaStore.seeking.set(false);
      this._mediaStore.waiting.set(false);
      this.satisfyMediaRequest('pause', event);
      this._fireWaiting.cancel();
    }
  );

  protected readonly _handleTimeUpdate = hostedEventListener(
    this._host,
    'vds-time-update',
    (event) => {
      this._mediaStore.currentTime.set(event.detail);
      this._mediaStore.waiting.set(false);
    }
  );

  protected readonly _handleVolumeChange = hostedEventListener(
    this._host,
    'vds-volume-change',
    (event) => {
      this._mediaStore.volume.set(event.detail.volume);
      this._mediaStore.muted.set(event.detail.muted);
      this.satisfyMediaRequest('volume', event);
    }
  );

  protected readonly _handleReplay = hostedEventListener(
    this._host,
    'vds-replay',
    (event) => {
      event.requestEvent = this._pendingMediaRequests.play[0];
    }
  );

  protected readonly _handleSeeking = hostedEventListener(
    this._host,
    'vds-seeking',
    (event) => {
      this._mediaStore.seeking.set(true);
      this._mediaStore.currentTime.set(event.detail);
      this.satisfyMediaRequest('seeking', event);
      if (this._lastWaitingEvent) this._fireWaiting();
    }
  );

  protected readonly _handleSeeked = hostedEventListener(
    this._host,
    'vds-seeked',
    (event) => {
      // We don't want `seeked` events firing while seeking is updating media playback position.
      if (this._isSeekingRequestPending) {
        this._mediaStore.seeking.set(true);
        event.stopImmediatePropagation();
      } else if (event.type === 'vds-seeked') {
        this._fireWaiting.cancel();
        this._mediaStore.seeking.set(false);
        this._mediaStore.currentTime.set(event.detail);
        this.satisfyMediaRequest('seeked', event);
      }
    }
  );

  protected _firingWaiting = false;
  protected _lastWaitingEvent?: Event;
  protected readonly _fireWaiting = debounce(() => {
    if (
      get(this.mediaStore.playing) ||
      this._isSeekingRequestPending ||
      !this._lastWaitingEvent
    ) {
      return;
    }

    this._firingWaiting = true;

    const event = vdsEvent('vds-waiting', {
      originalEvent: this._lastWaitingEvent
    });

    this._mediaStore.waiting.set(true);
    this._host.dispatchEvent(event);
    this._firingWaiting = false;
    this._lastWaitingEvent = undefined;
  }, 300);

  protected readonly _handleWaiting = hostedEventListener(
    this._host,
    'vds-waiting',
    (event) => {
      if (this._firingWaiting) return;
      event.preventDefault();
      this._mediaStore.waiting.set(false);
      this._lastWaitingEvent = event;
      this._fireWaiting();
    }
  );

  protected readonly _handleEnded = hostedEventListener(
    this._host,
    'vds-ended',
    (event) => {
      this._mediaStore.paused.set(true);
      this._mediaStore.playing.set(false);
      this._mediaStore.seeking.set(false);
      this._mediaStore.waiting.set(false);
      this._mediaStore.ended.set(true);
    }
  );

  protected readonly _handleAutoplayChange = hostedEventListener(
    this._host,
    'vds-autoplay-change',
    (event) => {
      this._mediaStore.autoplay.set(event.detail);
    }
  );

  protected readonly _handleError = hostedEventListener(
    this._host,
    'vds-error',
    (event) => {
      this._mediaStore.error.set(event.detail);
    }
  );

  protected readonly _handleFullscreenSupportChange = hostedEventListener(
    this._host,
    'vds-fullscreen-support-change',
    (event) => {
      this._mediaStore.canRequestFullscreen.set(event.detail);
    }
  );

  protected readonly _handlePosterChange = hostedEventListener(
    this._host,
    'vds-poster-change',
    (event) => {
      this._mediaStore.currentPoster.set(event.detail);
    }
  );

  protected readonly _handleLoopChange = hostedEventListener(
    this._host,
    'vds-loop-change',
    (event) => {
      this._mediaStore.loop.set(event.detail);
    }
  );

  protected readonly _handlePlaysinlineChange = hostedEventListener(
    this._host,
    'vds-playsinline-change',
    (event) => {
      this._mediaStore.playsinline.set(event.detail);
    }
  );

  protected readonly _handleControlsChange = hostedEventListener(
    this._host,
    'vds-controls-change',
    (event) => {
      this._mediaStore.controls.set(event.detail);
    }
  );

  protected readonly _handleMediaTypeChange = hostedEventListener(
    this._host,
    'vds-media-type-change',
    (event) => {
      this._mediaStore.mediaType.set(event.detail);
    }
  );

  protected readonly _handleDurationChange = hostedEventListener(
    this._host,
    'vds-duration-change',
    (event) => {
      this._mediaStore.duration.set(event.detail);
    }
  );

  protected readonly _handleProgress = hostedEventListener(
    this._host,
    'vds-progress',
    (event) => {
      const { buffered, seekable } = event.detail;
      const bufferedAmount =
        buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
      const seekableAmount =
        seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
      this._mediaStore.buffered.set(buffered);
      this._mediaStore.bufferedAmount.set(bufferedAmount);
      this._mediaStore.seekable.set(seekable);
      this._mediaStore.seekableAmount.set(seekableAmount);
    }
  );

  protected readonly _handleSrcChange = hostedEventListener(
    this._host,
    'vds-src-change',
    (event) => {
      this._mediaStore.currentSrc.set(event.detail);

      const dontReset = new Set<keyof WritableMediaStoreRecord>([
        'currentSrc',
        'autoplay',
        'canRequestFullscreen',
        'controls',
        'loop',
        'muted',
        'playsinline',
        'viewType',
        'volume'
      ]);

      const store = this._mediaStore;
      keysOf(store).forEach((prop) => {
        if (!dontReset.has(prop)) {
          (store[prop] as WritableStore<unknown>).set(store[prop].initialValue);
        }
      });
    }
  );
}
