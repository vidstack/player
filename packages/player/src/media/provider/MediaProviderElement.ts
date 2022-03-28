import {
  clampNumber,
  createIntersectionController,
  type DisconnectCallback,
  discoverable,
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

export const mediaProviderDiscoveryId = Symbol('@vidstack/media-provider-discovery');

/**
 * Fired when the media provider connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaProviderConnectEvent = DiscoveryEvent<MediaProviderElement>;

/**
 * This is the base class that all other concrete provider implementations will extend such as the
 * `Html5MediaElement` or `EmbeddedMediaElement`. This class should provide shared functionality
 * and behaviour that is required by all other providers. Anything specific should exist
 * in a higher-level implementation.
 *
 * A media provider employs the adapter design pattern to wrap an existing provider such as
 * the native HTMLMediaElement (i.e., `<video>`), or embedded media (i.e., `<iframe>`), and
 * provide a consistent interface that will enable the media controller to satisfy requests
 * (e.g., satisfy a play request by calling play on the media provider, and confirming the
 * operation was successful or if it failed).
 *
 * A media provider is generally responsible for:
 *
 * - Handling the media loading process and determining the most appropriate time to invoke it.
 * - Providing a minimal and consistent set of properties for the media controller to satisfy media
 *   requests (e.g., `paused` property for controlling playback state).
 * - Providing a consistent events interface by firing `vds-*` specific custom media events (e.g.,
 *   `vds-play`, `vds-playing`, and so on).
 * - Manually invoking autoplay so we can track failure.
 * - Providing a consistent fullscreen API to the underlying media provider element.
 *
 * Note: Properties on this element are considered to be "upgraded" as they're safe to call before
 * media is ready for playback.
 *
 * @events ../events.ts
 * @events ../request.events.ts
 * @link https://en.wikipedia.org/wiki/Adapter_pattern
 */
export abstract class MediaProviderElement extends LitElement {
  constructor() {
    super();

    discoverable(this, 'vds-media-provider-connect', { register: mediaProviderDiscoveryId });

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

    // If no media controller was attached, create one and attach to self.
    if (!this._controller) {
      const controller = new MediaController(this);
      controller.attachMediaProvider(this, (cb) => this._disconnectDisposal.add(cb));
    }

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
    this.mediaQueue.destroy();
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
    this.mediaQueue.queue('volume', () => {
      const volume = clampNumber(0, requestedVolume, 1);
      if (notEqual(this.state.volume, volume)) {
        this._setVolume(volume);
      }
    });
  }

  protected abstract _setVolume(newVolume: number): void;

  /** @internal */
  set _paused(shouldPause) {
    this.mediaQueue.queue('paused', () => {
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
    this.mediaQueue.queue('time', () => {
      if (notEqual(this.state.currentTime, requestedTime)) {
        this._setCurrentTime(requestedTime);
      }
    });
  }

  protected abstract _setCurrentTime(newTime: number): void;

  /** @internal */
  set _muted(shouldMute) {
    this.mediaQueue.queue('muted', () => {
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

    await this.mediaQueue.start();

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

    this.mediaQueue.stop();
    this.dispatchEvent(vdsEvent('vds-src-change', { detail: src ?? '' }));
  }

  // -------------------------------------------------------------------------------------------
  // Media Controller
  // -------------------------------------------------------------------------------------------

  protected _controller?: MediaController;
  protected _controllerQueue = new RequestQueue();

  get controller() {
    return this._controller;
  }

  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  @property({ attribute: 'log-level' })
  get logLevel() {
    return this._controller?.logLevel ?? 'silent';
  }

  set logLevel(level) {
    if (__DEV__) {
      this._controllerQueue.queue('log-level', () => {
        this._controller!.logLevel = level;
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
    return this._controller?.idleDelay ?? 0;
  }

  set idleDelay(delay) {
    this._controllerQueue.queue('idle-delay', () => {
      this._controller!.idleDelay = delay;
    });
  }

  /**
   * Attach a media controller to the media provider.
   */
  attachMediaController(controller: MediaController, onDisconnect: DisconnectCallback) {
    this._controller = controller;
    this._store = controller._store;
    this._state = controller.state;
    this._controllerQueue.start();

    onDisconnect(() => {
      this._controllerQueue.destroy();
      this._controller = undefined;
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
  readonly connectedQueue = hostRequestQueue(this);

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback, marked
   * by the `canPlay` property. If the media provider is ready, actions will be invoked immediately.
   */
  readonly mediaQueue = new RequestQueue();

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
