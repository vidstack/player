import {
  clampNumber,
  createIntersectionController,
  discover,
  type DiscoveryEvent,
  DisposalBin,
  FullscreenController,
  hostRequestQueue,
  isUndefined,
  listen,
  LogDispatcher,
  notEqual,
  RequestQueue,
  ScreenOrientationController,
  ScreenOrientationLock,
  unwrapStoreRecord,
  vdsEvent,
} from '@vidstack/foundation';
import { html, LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { MediaController } from '../controller';
import type { MediaEvents } from '../events';
import { createMediaStore, type ReadableMediaStoreRecord } from '../store';
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
 * @events ../events.ts
 * @events ../request.events.ts
 */
export abstract class MediaProviderElement extends LitElement {
  constructor() {
    super();

    discover(this, 'vds-media-provider-connect');

    const intersectionController = createIntersectionController(
      this,
      { threshold: 0 },
      (entries) => {
        if (this.loading !== 'lazy') {
          intersectionController.hostDisconnected();
          return;
        }

        if (entries[0]?.isIntersecting) {
          this.handleMediaCanLoad();
          intersectionController.hostDisconnected();
        }
      },
    );
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected readonly _disconnectDisposal = new DisposalBin();

  override connectedCallback(): void {
    super.connectedCallback();

    // If no media controller was attached, create one and attach to self.
    if (!this._mediaController) {
      const controller = new MediaController(this);
      controller.attachMediaProvider(this, (cb) => this._disconnectDisposal.add(cb));
    }

    this._logMediaEvents();

    // Give the initial hide poster event a chance to reach the controller.
    window.requestAnimationFrame(() => {
      if (isUndefined(this.canLoadPoster)) {
        this.canLoadPoster = true;
      }
    });
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.dispatchEvent(
      vdsEvent('vds-fullscreen-support-change', {
        detail: this.canFullscreen,
      }),
    );

    if (this.loading === 'eager') {
      this.handleMediaCanLoad();
    }
  }

  override render() {
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.mediaRequestQueue.destroy();
    this._disconnectDisposal.empty();
  }

  abstract handleDefaultSlotChange(): void | Promise<void>;

  // -------------------------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------------------------

  protected readonly _logger = __DEV__ ? new LogDispatcher(this) : undefined;

  protected _logMediaEvents() {
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
        'vds-waiting',
      ];

      mediaEvents.forEach((eventType) => {
        const dispose = listen(this, eventType, (event) => {
          this._logger
            ?.infoGroup(`📡 dispatching \`${eventType}\``)
            .labelledLog('State', { ...this.state })
            .labelledLog('Event', event)
            .dispatch();
        });

        this._disconnectDisposal.add(dispose);
      });
    }
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @internal */
  set _volume(requestedVolume) {
    this.mediaRequestQueue.queue('volume', () => {
      const volume = clampNumber(0, requestedVolume, 1);
      if (notEqual(this.state.volume, volume)) {
        this._setVolume(volume);
      }
    });
  }

  protected abstract _setVolume(newVolume: number): void;

  /** @internal */
  set _paused(shouldPause) {
    this.mediaRequestQueue.queue('paused', () => {
      if (this.state.paused === shouldPause) return;

      try {
        if (!shouldPause) {
          this.play();
        } else {
          this.pause();
        }
      } catch (e) {
        this._logger?.error('paused-change-fail', e);
      }
    });
  }

  /** @internal */
  set _currentTime(requestedTime) {
    this.mediaRequestQueue.queue('time', () => {
      if (notEqual(this.state.currentTime, requestedTime)) {
        this._setCurrentTime(requestedTime);
      }
    });
  }

  protected abstract _setCurrentTime(newTime: number): void;

  /** @internal */
  set _muted(shouldMute) {
    this.mediaRequestQueue.queue('muted', () => {
      if (notEqual(this.state.muted, shouldMute)) {
        this._setMuted(shouldMute);
      }
    });
  }

  protected abstract _setMuted(isMuted: boolean): void;

  // -------------------------------------------------------------------------------------------
  // Loading
  // -------------------------------------------------------------------------------------------

  /**
   * Determines whether the poster can be set. Used to avoid loading posters twice when a custom
   * poster element is being used (eg: `<vds-poster>`). This is set internally by the media
   * controller element.
   *
   * @internal
   */
  @state() canLoadPoster?: boolean;

  /**
   * Whether media is allowed to begin loading. This depends on the `loading` configuration. If
   * `eager`, `canLoad` will be `true` immediately, and if `lazy` this will become `true` once
   * the media has entered the viewport.
   */
  get canLoad() {
    return this.state.canLoad;
  }

  /**
   * Indicates when the provider can begin loading media. If `eager`, media will be loaded
   * immediately, and `lazy` will delay loading until the provider has entered the viewport.
   */
  @property({ attribute: 'loading' })
  loading: 'eager' | 'lazy' = 'eager';

  /**
   * Called when media can begin loading.
   */
  handleMediaCanLoad() {
    this.dispatchEvent(vdsEvent('vds-can-load'));
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
    if (!this.state.canPlay) {
      throw Error(`Media is not ready - wait for \`vds-can-play\` event.`);
    }
  }

  protected async _resetPlaybackIfEnded(): Promise<void> {
    if (!this.state.ended || this.state.currentTime === 0) return;
    return this._setCurrentTime(0);
  }

  /**
   * @throws {Error} - Will throw if player is not in a video view.
   */
  protected _throwIfNotVideoView() {
    if (this.state.viewType !== ViewType.Video) {
      throw Error('Player is currently not in a video view.');
    }
  }

  protected async _handleMediaReady({ event, duration }: { event?: Event; duration: number }) {
    if (this.state.canPlay) return;

    this.dispatchEvent(
      vdsEvent('vds-can-play', {
        triggerEvent: event,
        detail: { duration },
      }),
    );

    await this.mediaRequestQueue.start();

    if (__DEV__) {
      this._logger
        ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
        .labelledLog('State', { ...this.state })
        .labelledLog('Event', event)
        .dispatch();
    }

    await this.attemptAutoplay();
  }

  protected _autoplayAttemptPending = false;

  get canAttemptAutoplay() {
    return this.state.autoplay && !this.state.started;
  }

  async attemptAutoplay(): Promise<void> {
    if (!this.state.canPlay || !this.canAttemptAutoplay) return;

    this._autoplayAttemptPending = true;

    try {
      await this.play();
      this.dispatchEvent(vdsEvent('vds-autoplay', { detail: { muted: this._muted } }));
    } catch (error) {
      this.dispatchEvent(
        vdsEvent('vds-autoplay-fail', {
          detail: {
            muted: this._muted,
            error: error as Error,
          },
        }),
      );
      this.requestUpdate();
    }

    this._autoplayAttemptPending = false;
  }

  protected _handleMediaSrcChange(src: string) {
    if (__DEV__) {
      this._logger
        ?.infoGroup('📼 Media source change')
        .labelledLog('Src', this.state.src)
        .dispatch();
    }

    this.mediaRequestQueue.stop();
    this.dispatchEvent(vdsEvent('vds-src-change', { detail: src ?? '' }));
  }

  // -------------------------------------------------------------------------------------------
  // Media Controller
  // -------------------------------------------------------------------------------------------

  protected _mediaController?: MediaController;
  protected _mediaControllerConnectedQueue = new RequestQueue();

  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  @property({ attribute: 'log-level' })
  get logLevel() {
    return this._mediaController?.logLevel ?? 'silent';
  }

  set logLevel(level) {
    if (__DEV__) {
      this._mediaControllerConnectedQueue.queue('log-level', () => {
        this._mediaController!.logLevel = level;
      });
    }
  }

  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   *
   * @default 2000
   */
  @property({ attribute: 'idle-delay', type: Number })
  get idleDelay() {
    return this._mediaController?.idleDelay ?? 0;
  }

  set idleDelay(delay) {
    this._mediaControllerConnectedQueue.queue('idle-delay', () => {
      this._mediaController!.idleDelay = delay;
    });
  }

  /**
   * Attach a media controller to the media provider.
   */
  attachMediaController(
    mediaController: MediaController,
    onDisconnect: (callback: () => void) => void,
  ) {
    this._mediaController = mediaController;
    this._store = mediaController._store;
    this._state = mediaController.state;
    this._mediaControllerConnectedQueue.start();

    onDisconnect(() => {
      this._mediaControllerConnectedQueue.destroy();
      this._mediaController = undefined;
      this._store = createMediaStore();
      this._state = unwrapStoreRecord(this._store);
    });
  }

  // -------------------------------------------------------------------------------------------
  // Store
  // -------------------------------------------------------------------------------------------

  /** @internal */
  _store = createMediaStore();

  /** @internal */
  _state = unwrapStoreRecord(this._store);

  store(): ReadableMediaStoreRecord {
    return this._store;
  }

  get state() {
    return this._state;
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be applied safely after the element has connected to the DOM.
   */
  readonly _connectedQueue = hostRequestQueue(this);

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

  readonly fullscreenController = new FullscreenController(this, this.screenOrientationController);

  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   */
  get canFullscreen(): boolean {
    return this.fullscreenController.isSupported;
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
}
