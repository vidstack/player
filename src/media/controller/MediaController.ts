import { ReactiveController, ReactiveElement } from 'lit';

import {
  ContextProviderController,
  createContext,
  provideContextRecord
} from '../../base/context';
import { DisposalBin, listen } from '../../base/events';
import {
  FullscreenChangeEvent,
  FullscreenErrorEvent
} from '../../base/fullscreen';
import {
  Logger,
  LogLevel,
  LogLevelName,
  LogLevelNameMap
} from '../../base/logger';
import { RequestQueue } from '../../base/queue';
import { DEV_MODE } from '../../global/env';
import { keysOf } from '../../utils/object';
import { isArray, isNil } from '../../utils/unit';
import {
  cloneMediaContextRecord,
  createMediaContextRecord,
  mediaContext,
  MediaContextProviderRecord,
  MediaContextRecordValues
} from '../context';
import {
  PlayErrorEvent,
  PlayEvent,
  SeekedEvent,
  SeekingEvent,
  VolumeChangeEvent
} from '../events';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/MediaProviderElement';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PendingMediaRequests,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '../request.events';

export type MediaControllerHost = ReactiveElement & {
  exitFullscreen(): Promise<void>;
};

/* c8 ignore next */
const _logLevel = createContext(LogLevel.Silent);

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
  protected readonly _disconnectDisposal: DisposalBin;

  /* c8 ignore start */
  protected readonly _logger?: Logger;
  protected readonly _logLevelProvider: ContextProviderController<LogLevel>;
  /* c8 ignore stop */

  protected readonly _mediaProviderConnectedQueue: RequestQueue;

  protected readonly _mediaProviderDisconnectedDisposal: DisposalBin;

  constructor(protected readonly _host: MediaControllerHost) {
    /* c8 ignore next */
    this._logLevelProvider = _logLevel.provide(_host);

    /* c8 ignore start */
    if (DEV_MODE && !Logger._consumeLogLevel) {
      // Inject log level context into `Logger` to avoid dep cycle.
      Logger._consumeLogLevel = _logLevel.consume;
    }
    /* c8 ignore stop */

    this.mediaCtx = provideContextRecord(_host, mediaContext);

    /* c8 ignore next */
    this._logger = DEV_MODE && new Logger(_host, { owner: this });

    this._disconnectDisposal = new DisposalBin(
      _host,
      /* c8 ignore next */
      DEV_MODE && { name: 'disconnectDisposal', owner: this }
    );

    this._mediaProviderConnectedQueue = new RequestQueue(
      _host,
      /* c8 ignore next */
      DEV_MODE && {
        name: 'mediaProviderConnectedQueue',
        owner: this
      }
    );

    this._mediaProviderDisconnectedDisposal = new DisposalBin(
      _host,
      /* c8 ignore next */
      DEV_MODE && { name: 'mediaProviderDisconnectDisposal', owner: this }
    );

    _host.addController(this);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  hostConnected() {
    /* c8 ignore start */
    if (DEV_MODE) {
      this._logEvents();
      this._logErrors();
    }
    /* c8 ignore stop */

    this._addEventListeners();
  }

  hostDisconnected() {
    this._mediaProviderConnectedQueue.destroy();
    this._mediaProviderDisconnectedDisposal.empty();
    this._disconnectDisposal.empty();
  }

  protected _addEventListeners() {
    const eventListeners = {
      //
      'vds-media-provider-connect': this._handleMediaProviderConnect,
      'vds-mute-request': this._handleMuteRequest,
      'vds-unmute-request': this._handleUnmuteRequest,
      'vds-play-request': this._handlePlayRequest,
      'vds-pause-request': this._handlePauseRequest,
      'vds-seeking-request': this._handleSeekingRequest,
      'vds-seek-request': this._handleSeekRequest,
      'vds-volume-change-request': this._handleVolumeChangeRequest,
      'vds-enter-fullscreen-request': this._handleEnterFullscreenRequest,
      'vds-exit-fullscreen-request': this._handleExitFullscreenRequest,
      'vds-fullscreen-change': this._handleFullscreenChange,
      'vds-fullscreen-error': this._handleFullscreenError,
      //
      'vds-play': [this._handlePlay, { capture: true }],
      'vds-play-error': [this._handlePlayError, { capture: true }],
      'vds-pause': [this._handlePause, { capture: true }],
      'vds-volume-change': [this._handleVolumeChange, { capture: true }],
      'vds-seeking': [this._handleSeeking, { capture: true }],
      'vds-seeked': [this._handleSeeked, { capture: true }],
      //
      seeked: [this._handleSeeked, { capture: true }]
    };

    keysOf(eventListeners).forEach((eventType) => {
      const eventListener = eventListeners[eventType];

      const listener = isArray(eventListener)
        ? eventListener[0]
        : eventListener;

      const options = isArray(eventListener) ? eventListener[1] : undefined;

      const dispose = listen(
        this._host,
        eventType,
        (listener as () => void).bind(this),
        options as EventListenerOptions
      );

      this._disconnectDisposal.add(dispose);
    });
  }

  // -------------------------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------------------------

  get logLevel(): LogLevelName {
    /* c8 ignore next */
    return DEV_MODE ? LogLevelNameMap[this._logLevelProvider.value] : 'silent';
  }

  set logLevel(newLevel: LogLevelName) {
    /* c8 ignore next */
    const numericLevel = DEV_MODE
      ? Object.values(LogLevelNameMap).findIndex((l) => l === newLevel)
      : 0;

    this._logLevelProvider.value = numericLevel >= 0 ? numericLevel : 0;
  }

  protected _logEvents() {
    /* c8 ignore start */
    if (DEV_MODE) {
      const loggedEvents: (keyof GlobalEventHandlersEventMap)[] = [
        'vds-controls-change',
        'vds-fullscreen-change'
      ];

      loggedEvents.forEach((eventType) => {
        const dispose = listen(this._host, eventType, (event) => {
          this._logger!.infoGroup(`📡 dispatching \`${eventType}\``)
            .appendWithLabel('Event', event)
            .appendWithLabel('Provider', this.mediaProvider)
            .end();
        });

        this._disconnectDisposal.add(dispose);
      });
    }
    /* c8 ignore stop */
  }

  protected _logErrors() {
    /* c8 ignore start */
    if (DEV_MODE) {
      const dispose = listen(this._host, 'vds-error', (event) => {
        this._logger!.errorGroup(event.type)
          .appendWithLabel('Context', this.mediaCtx)
          .appendWithLabel('Event', event)
          .appendWithLabel('Provider', this.mediaProvider)
          .end();
      });

      this._disconnectDisposal.add(dispose);
    }
    /* c8 ignore stop */
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

  protected _handleMediaProviderConnect(event: MediaProviderConnectEvent) {
    event.stopPropagation();

    const { element, onDisconnect } = event.detail;

    if (this.mediaProvider === element) return;

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger!.infoGroup('media provider connected')
        .appendWithLabel('Provider', element)
        .end();
    }
    /* c8 ignore stop */

    this._handleMediaProviderDisconnect();

    this._mediaProvider = element;

    this._attachMediaContextRecordToProvider();
    this._flushMediaProviderConnectedQueue();

    onDisconnect(this._handleMediaProviderDisconnect.bind(this));
  }

  protected _handleMediaProviderDisconnect() {
    if (isNil(this.mediaProvider)) return;

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger!.infoGroup('media provider disconnected')
        .appendWithLabel('Provider', this.mediaProvider)
        .end();
    }
    /* c8 ignore stop */

    this._mediaProviderConnectedQueue.destroy();
    this._mediaProviderDisconnectedDisposal.empty();
    this._mediaProvider = undefined;
  }

  protected _flushMediaProviderConnectedQueue() {
    this._mediaProviderConnectedQueue.flush();
    this._mediaProviderConnectedQueue.serveImmediately = true;

    this._mediaProviderDisconnectedDisposal.add(() => {
      this._mediaProviderConnectedQueue.serveImmediately = false;
      this._mediaProviderConnectedQueue.reset();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Context
  // -------------------------------------------------------------------------------------------

  /**
   * Media context provider record which is injected by the media controller into the media
   * provider, so it can be managed and updated by it.
   *
   * @internal
   */
  readonly mediaCtx: MediaContextProviderRecord;

  /**
   * An immutable snapshot of the current media state.
   */
  get mediaState(): Readonly<MediaContextRecordValues> {
    return cloneMediaContextRecord(this.mediaCtx);
  }

  protected _attachMediaContextRecordToProvider() {
    if (isNil(this.mediaProvider)) return;

    // Copy over context values before setting on provider.
    Object.keys(this.mediaProvider.ctx).forEach((prop) => {
      this.mediaCtx[prop] = this.mediaProvider!.ctx[prop];
    });

    // @ts-expect-error - Override readonly
    this.mediaProvider.ctx = this.mediaCtx;

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger!.infoGroup('attached context record')
        .appendWithLabel('Provider', this.mediaProvider)
        .appendWithLabel('Context', this.mediaCtx)
        .end();
    }
    /* c8 ignore stop */

    this._mediaProviderDisconnectedDisposal.add(() => {
      const ctx = createMediaContextRecord();

      // Copy over context values before setting on provider.
      Object.keys(ctx).forEach((prop) => {
        ctx[prop] = this.mediaCtx[prop];
      });

      // @ts-expect-error - Override readonly
      this.mediaProvider.ctx = ctx;
    });
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
      this._logger!.infoGroup(`📬 received \`${event.type}\``)
        .appendWithLabel('Request', event)
        .end();
    }
    /* c8 ignore stop */

    return true;
  }

  protected _handleMuteRequest(event: MuteRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('muted', () => {
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.muted = true;
    });
  }

  protected _handleUnmuteRequest(event: UnmuteRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('muted', () => {
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.muted = false;
    });
  }

  protected _handlePlayRequest(event: PlayRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('paused', () => {
      this._pendingMediaRequests.play.push(event);
      this.mediaProvider!.paused = false;
    });
  }

  protected _handlePauseRequest(event: PauseRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('paused', () => {
      this._pendingMediaRequests.pause.push(event);
      this.mediaProvider!.paused = true;
    });
  }

  protected _isSeeking = false;

  protected _handleSeekingRequest(event: SeekingRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('seeking', () => {
      this._pendingMediaRequests.seeking.push(event);
      this._isSeeking = true;
      this.mediaProvider!.currentTime = event.detail;
    });
  }

  protected _handleSeekRequest(event: SeekRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('seeking', () => {
      this._pendingMediaRequests.seeked.push(event);
      this._isSeeking = false;

      let time = event.detail;

      // Snap to end if close enough.
      if (this.mediaProvider!.duration - event.detail < 1) {
        time = this.mediaProvider!.duration;
      }

      this.mediaProvider!.currentTime = time;
    });
  }

  protected _handleVolumeChangeRequest(event: VolumeChangeRequestEvent): void {
    if (!this._mediaRequestEventGateway(event)) return;
    this._mediaProviderConnectedQueue.queue('volume', () => {
      this._pendingMediaRequests.volume.push(event);
      this.mediaProvider!.volume = event.detail;
    });
  }

  protected async _handleEnterFullscreenRequest(
    event: EnterFullscreenRequestEvent
  ): Promise<void> {
    if (!this._mediaRequestEventGateway(event)) return;
    this._pendingMediaRequests.fullscreen.push(event);
    await this._host.requestFullscreen();
  }

  protected async _handleExitFullscreenRequest(
    event: ExitFullscreenRequestEvent
  ): Promise<void> {
    if (!this._mediaRequestEventGateway(event)) return;
    this._pendingMediaRequests.fullscreen.push(event);
    await this._host.exitFullscreen();
  }

  protected _handleFullscreenChange(event: FullscreenChangeEvent): void {
    this.mediaCtx.fullscreen = event.detail;
    this.satisfyMediaRequest('fullscreen', event);
  }

  protected _handleFullscreenError(event: FullscreenErrorEvent): void {
    this.satisfyMediaRequest('fullscreen', event);
  }

  // -------------------------------------------------------------------------------------------
  // Media Events
  // -------------------------------------------------------------------------------------------

  protected _handlePlay(event: PlayEvent): void {
    this.satisfyMediaRequest('play', event);
  }

  protected _handlePlayError(event: PlayErrorEvent): void {
    this.satisfyMediaRequest('play', event);
  }

  protected _handlePause(event: PlayErrorEvent): void {
    this.satisfyMediaRequest('pause', event);
  }

  protected _handleVolumeChange(event: VolumeChangeEvent): void {
    this.satisfyMediaRequest('volume', event);
  }

  protected _handleSeeking(event: SeekingEvent): void {
    this.satisfyMediaRequest('seeking', event);
  }

  protected _handleSeeked(event: SeekedEvent): void {
    // We don't want `seeked` events firing while seeking is updating media playback position.
    if (this._isSeeking) {
      event.stopImmediatePropagation();
    } else if (event.type === 'vds-seeked') {
      this.satisfyMediaRequest('seeked', event);
    }
  }
}
