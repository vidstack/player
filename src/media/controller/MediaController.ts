import debounce from 'just-debounce-it';
import { ReactiveController, ReactiveElement } from 'lit';

import { DisposalBin, hostedEventListener, vdsEvent } from '../../base/events';
import { RequestQueue } from '../../base/queue';
import { DEV_MODE } from '../../global/env';
import { keysOf } from '../../utils/object';
import { isNil } from '../../utils/unit';
import { mediaServiceContext } from '../machine';
import { MediaProviderElement } from '../provider/MediaProviderElement';
import { PendingMediaRequests } from '../request.events';

export type MediaControllerHost = ReactiveElement & {
  exitFullscreen?(): Promise<void>;
};

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components and plugins. The main responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * 💡 The base `MediaPlayer` acts as both a media controller and provider.
 */
export class MediaController implements ReactiveController {
  protected readonly _disconnectDisposal = new DisposalBin();
  protected readonly _mediaProviderConnectedQueue = new RequestQueue();
  protected readonly _mediaProviderDisconnectedDisposal = new DisposalBin();

  constructor(protected readonly _host: MediaControllerHost) {
    this.mediaServiceContext = mediaServiceContext.provide(_host);
    _host.addController(this);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  hostDisconnected() {
    this._clearPendingMediaRequests();
    this._mediaProviderConnectedQueue.destroy();
    this._mediaProviderDisconnectedDisposal.empty();
    this._disconnectDisposal.empty();
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider: MediaProviderElement | undefined;

  get mediaProvider() {
    return this._mediaProvider;
  }

  /** @internal */
  setMediaProvider(mediaProvider?: MediaProviderElement) {
    this._mediaProvider = mediaProvider;
  }

  protected _handleMediaProviderConnect = hostedEventListener(
    this._host,
    'vds-media-provider-connect',
    (event) => {
      event.stopPropagation();

      const { element, onDisconnect } = event.detail;

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
  // Media Context
  // -------------------------------------------------------------------------------------------

  private readonly mediaServiceContext: ReturnType<
    typeof mediaServiceContext['provide']
  >;

  /**
   * Media service used to keep track of current media state and context. This is consumed
   * by a provider, and UI components, so they can subscribe to media state changes.
   *
   * @internal
   */
  get mediaService() {
    return this.mediaServiceContext.value;
  }

  /**
   * A snapshot of the current media state.
   */
  get mediaState() {
    return Object.assign({}, this.mediaServiceContext.value.state.context);
  }

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

    /* c8 ignore start */
    if (DEV_MODE) {
      // TODO: Dispatch
      // this._logger!.infoGroup(`📬 received \`${event.type}\``)
      //   .appendWithLabel('Request', event)
      //   .end();
    }
    /* c8 ignore stop */

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
        this.mediaProvider!.currentTime = event.detail;
        this._fireWaiting.cancel();
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
      this.mediaService.send({
        type: 'fullscreen-change',
        fullscreen: event.detail
      });

      this.satisfyMediaRequest('fullscreen', event);
    }
  );

  protected readonly _handleFullscreenError = hostedEventListener(
    this._host,
    'vds-fullscreen-error',
    (event) => {
      this.satisfyMediaRequest('fullscreen', event);
    }
  );

  // -------------------------------------------------------------------------------------------
  // Media Events
  // -------------------------------------------------------------------------------------------

  protected readonly _handlePlay = hostedEventListener(
    this._host,
    'vds-play',
    (event) => {
      this.satisfyMediaRequest('play', event);
    }
  );

  protected readonly _handlePlayError = hostedEventListener(
    this._host,
    'vds-play-error',
    (event) => {
      this.satisfyMediaRequest('play', event);
    }
  );

  protected readonly _handlePlaying = hostedEventListener(
    this._host,
    'vds-playing',
    (event) => {
      this._fireWaiting.cancel();

      if (this._isSeekingRequestPending) {
        event.stopImmediatePropagation();
      }
    }
  );

  protected readonly _handlePause = hostedEventListener(
    this._host,
    'vds-pause',
    (event) => {
      this.satisfyMediaRequest('pause', event);
      this._fireWaiting.cancel();
    }
  );

  protected readonly _handleVolumeChange = hostedEventListener(
    this._host,
    'vds-volume-change',
    (event) => {
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
        event.stopImmediatePropagation();
      } else if (event.type === 'vds-seeked') {
        this._fireWaiting.cancel();
        this.satisfyMediaRequest('seeked', event);
      }
    }
  );

  protected _firingWaiting = false;
  protected _lastWaitingEvent?: Event;
  protected readonly _fireWaiting = debounce(() => {
    if (
      this.mediaState.playing ||
      this._isSeekingRequestPending ||
      !this._lastWaitingEvent
    ) {
      return;
    }

    this._firingWaiting = true;

    const event = vdsEvent('vds-waiting', {
      originalEvent: this._lastWaitingEvent
    });

    this.mediaService.send({ type: 'waiting', trigger: event });
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
      this._lastWaitingEvent = event;
      this._fireWaiting();
    }
  );
}
