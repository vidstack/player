import {
  clampNumber,
  copyStoreRecords,
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
  RequestQueue,
  ScreenOrientationController,
  ScreenOrientationLock,
  setAttribute,
  unwrapStoreRecord,
  vdsEvent,
} from '@vidstack/foundation';
import { html, LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { type MediaController } from '../controller';
import type { MediaEvents } from '../events';
import {
  createMediaStore,
  type ReadableMediaStoreRecord,
  WritableMediaStoreRecord,
} from '../store';
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
 * @see {@link https://en.wikipedia.org/wiki/Adapter_pattern}
 */
export abstract class MediaProviderElement extends LitElement {
  constructor() {
    super();

    discoverable(this, 'vds-media-provider-connect', { register: mediaProviderDiscoveryId });

    const intersectionController = createIntersectionController(
      this,
      { target: this, threshold: 0 },
      (entries) => {
        if (this.loading !== 'lazy') {
          intersectionController.hostDisconnected();
          return;
        }

        if (entries[0]?.isIntersecting) {
          this.startLoadingMedia();
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

    this.dispatchEvent(
      vdsEvent('vds-fullscreen-support-change', {
        detail: this.canFullscreen,
      }),
    );

    if (this.loading === 'eager') {
      this.startLoadingMedia();
    }
  }

  override render() {
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
  }

  override disconnectedCallback() {
    this._updateMediaStoreOnDisconnect(this._store);
    this.mediaQueue.destroy();
    this._disconnectDisposal.empty();
    super.disconnectedCallback();
  }

  /* @internal */
  abstract handleDefaultSlotChange(): void | Promise<void>;

  protected _updateMediaStoreOnDisconnect(store: WritableMediaStoreRecord) {
    store.paused.set(true);
    store.playing.set(false);
    store.seeking.set(false);
    store.waiting.set(false);
    store.fullscreen.set(false);
  }

  /**
   * Hard destroy the media provider and clear all state. This voids the media provider unusable,
   * so call with caution. Generally best to only call this in a framework destroy hook.
   */
  destroy() {
    this.disconnectedCallback();
    this.dispatchEvent(vdsEvent('vds-destroy'));
  }

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
        'vds-current-src-change',
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

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @defaultValue 1
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume}
   */
  @property({ type: Number })
  get volume() {
    return this._getVolume();
  }

  set volume(newVolume) {
    this.mediaQueue.queue('volume', () => {
      const oldVol = this.volume;
      const newVol = clampNumber(0, newVolume, 1);
      if (oldVol !== newVol) {
        this._setVolume(newVol);
        this.requestUpdate('volume', oldVol);
      }
    });
  }

  protected abstract _getVolume(): number;
  protected abstract _setVolume(newVolume: number): void;

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `false` will begin/resume playback.
   *
   * @defaultValue true
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused}
   */
  @property({ type: Boolean })
  get paused() {
    return this._getPaused();
  }

  set paused(newPaused) {
    this.mediaQueue.queue('paused', () => {
      if (this.paused === newPaused) return;

      try {
        if (!newPaused) {
          this.play();
        } else {
          this.pause();
        }

        this.requestUpdate('paused', !newPaused);
      } catch (e) {
        this._logger?.error('paused-change-fail', e);
      }
    });
  }

  protected abstract _getPaused(): boolean;

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media indicated by the `duration`.
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime}
   */
  @property({ type: Number })
  get currentTime() {
    return this._getCurrentTime();
  }

  set currentTime(newTime) {
    this.mediaQueue.queue('current-time', () => {
      const oldTime = this.currentTime;
      if (oldTime !== newTime) {
        this._setCurrentTime(newTime);
        this.requestUpdate('currentTime', oldTime);
      }
    });
  }

  protected abstract _getCurrentTime(): number;
  protected abstract _setCurrentTime(newTime: number): void;

  /**
   * Whether the audio is muted or not.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted}
   */
  @property({ type: Boolean })
  get muted() {
    return this._getMuted();
  }

  set muted(newMuted) {
    this.mediaQueue.queue('muted', () => {
      const oldMuted = this.muted;
      if (oldMuted !== newMuted) {
        this._setMuted(newMuted);
        this.requestUpdate('muted', oldMuted);
      }
    });
  }

  protected abstract _getMuted(): boolean;
  protected abstract _setMuted(isMuted: boolean): void;

  /**
   * A URL for an image to be shown while the video is downloading.
   */
  @property()
  get poster() {
    return this.state.poster;
  }

  set poster(newPoster) {
    const oldPoster = this.poster;
    if (oldPoster !== newPoster) {
      this.dispatchEvent(vdsEvent('vds-poster-change', { detail: newPoster }));
      this.requestUpdate('poster', oldPoster);
    }
  }

  /**
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop}
   */
  @property({ type: Boolean })
  get loop() {
    return this.state.loop;
  }

  set loop(newLoop) {
    const oldLoop = this.loop;
    if (oldLoop !== newLoop) {
      this.dispatchEvent(vdsEvent('vds-loop-change', { detail: newLoop }));
      this.requestUpdate('loop', oldLoop);
    }
  }

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls}
   */
  @property({ type: Boolean })
  get controls() {
    return this.state.controls;
  }

  set controls(newControls) {
    const oldControls = this.controls;
    if (oldControls !== newControls) {
      this.dispatchEvent(vdsEvent('vds-controls-change', { detail: newControls }));
      this.requestUpdate('controls', oldControls);
    }
  }

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
   * Whether media is allowed to begin loading. This depends on the `loading` configuration.
   *
   * - If `eager`, this will return `true` immediately.
   * - If `lazy`, this will return `true` after the media has entered the viewport.
   * - If `custom`, this will return `true` after the `startLoadingMedia()` method is called.
   */
  get canLoad() {
    return this.state.canLoad;
  }

  /**
   * Indicates when the provider can begin loading media.
   *
   * - If `eager` media will be loaded immediately.
   * - If `lazy` media will delay loading until the provider has entered the viewport.
   * - If `custom` media will wait for the `startLoadingMedia()` method to be called.
   *
   * @defaultValue 'lazy'
   */
  @property({ attribute: 'loading' })
  loading: 'eager' | 'lazy' | 'custom' = 'lazy';

  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   */
  startLoadingMedia() {
    if (this.state.canPlay) return;
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
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  abstract play(): Promise<void>;

  /**
   * Pauses playback of the media.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  abstract pause(): Promise<void>;

  /**
   * @throws Will throw if media is not ready for playback.
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
   * @throws Will throw if player is not in a video view.
   */
  protected _throwIfNotVideoView() {
    if (this.state.viewType !== ViewType.Video) {
      throw Error('Player is currently not in a video view.');
    }
  }

  protected async _handleMediaReady({ event, duration }: { event?: Event; duration: number }) {
    // Return if it was already fired.
    if (this.state.canPlay) return;

    this.dispatchEvent(
      vdsEvent('vds-can-play', {
        triggerEvent: event,
        detail: { duration },
      }),
    );

    this.mediaQueue.start();

    if (__DEV__) {
      this._logger
        ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
        .labelledLog('State', { ...this.state })
        .labelledLog('Event', event)
        .dispatch();
    }

    await this._attemptAutoplay();
  }

  protected _handleCurrentSrcChange(currentSrc: string, triggerEvent?: Event) {
    if (this.state.currentSrc === currentSrc) return;

    if (__DEV__) {
      this._logger
        ?.infoGroup('📼 Media source change')
        .labelledLog('Src', this.state.src)
        .labelledLog('Current Src', currentSrc)
        .dispatch();
    }

    this.mediaQueue.stop();

    this.dispatchEvent(
      vdsEvent('vds-current-src-change', {
        detail: currentSrc,
        triggerEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Autoplay
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
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay}
   */
  @property({ type: Boolean })
  get autoplay() {
    return this.state.autoplay;
  }

  set autoplay(newAutoplay: boolean) {
    if (this.autoplay !== newAutoplay) {
      this.dispatchEvent(vdsEvent('vds-autoplay-change', { detail: newAutoplay }));
      this.requestUpdate('autoplay', !newAutoplay);
    }

    this._attemptAutoplay();
  }

  protected _attemptingAutoplay = false;

  protected get _canAttemptAutoplay() {
    return this.state.canPlay && this.state.autoplay && !this.state.started;
  }

  protected async _attemptAutoplay(): Promise<void> {
    if (!this._canAttemptAutoplay) return;

    this._attemptingAutoplay = true;

    try {
      await this.play();
      this.dispatchEvent(vdsEvent('vds-autoplay', { detail: { muted: this.muted } }));
    } catch (error) {
      this.dispatchEvent(
        vdsEvent('vds-autoplay-fail', {
          detail: {
            muted: this.muted,
            error: error as Error,
          },
        }),
      );
      this.requestUpdate();
    }

    this._attemptingAutoplay = false;
  }

  // -------------------------------------------------------------------------------------------
  // Media Controller
  // -------------------------------------------------------------------------------------------

  protected _controller?: MediaController;

  /**
   * Queue actions to be applied safely after the provider has attached to the media controller.
   */
  protected controllerQueue = new RequestQueue();

  /**
   * The media controller that this provider is attached to.
   */
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
      this.controllerQueue.queue('log-level', () => {
        this._controller!.logLevel = level;
      });
    }
  }

  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   *
   * @defaultValue 2000
   */
  @property({ attribute: 'idle-delay', type: Number })
  get idleDelay() {
    return this._controller?.idleDelay ?? 0;
  }

  set idleDelay(delay) {
    this.controllerQueue.queue('idle-delay', () => {
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
    this.controllerQueue.start();

    onDisconnect(() => {
      this.controllerQueue.destroy();

      this._store = createMediaStore();
      this._state = unwrapStoreRecord(this._store);

      if (this._controller) {
        copyStoreRecords(this._controller._store, this._store);
        this._updateMediaStoreOnDisconnect(this._controller._store);
      }

      this._controller = undefined;
    });
  }

  // Override to ensure media events reach the media controller.
  override dispatchEvent(event: Event): boolean {
    if (this.isConnected && !this._controller && event.type.startsWith('vds-')) {
      this.controllerQueue.queue(event.type, () => {
        super.dispatchEvent(event);
      });

      return false;
    }

    return super.dispatchEvent(event);
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
   * Queue actions to be applied after the element has connected to the DOM.
   */
  readonly connectedQueue = hostRequestQueue(this);

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback (i.e.,
   * `canPlay`). If the media provider is ready, actions will be invoked immediately.
   */
  readonly mediaQueue = new RequestQueue();

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  /**
   * Controls the screen orientation of the current browser window.
   */
  readonly screenOrientationController = new ScreenOrientationController(this);

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * Controls the fullscreen state of the current element.
   */
  readonly fullscreenController = new FullscreenController(this, this.screenOrientationController);

  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  get canFullscreen(): boolean {
    return this.fullscreenController.isSupported;
  }

  /**
   * Whether the provider is currently in fullscreen mode.
   *
   * @defaultValue false
   */
  get fullscreen(): boolean {
    return this.fullscreenController.isFullscreen;
  }

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   *
   * @defaultValue undefined
   */
  @property({ attribute: 'fullscreen-orientation' })
  get fullscreenOrientation(): ScreenOrientationLock | undefined {
    return this.fullscreenController.screenOrientationLock;
  }

  set fullscreenOrientation(lockType) {
    const prevLockType = this.fullscreenController.screenOrientationLock;
    if (prevLockType !== lockType) {
      this.fullscreenController.screenOrientationLock = lockType;
      this.requestUpdate('fullscreen-orientation', prevLockType);
    }
  }

  /**
   * Attempts to display the element in fullscreen. The promise will resolve if successful, and
   * reject if not.
   */
  enterFullscreen(): Promise<void> {
    return this.fullscreenController.enterFullscreen();
  }

  /**
   * Attempts to display the element inline by exiting fullscreen.
   */
  exitFullscreen(): Promise<void> {
    return this.fullscreenController.exitFullscreen();
  }
}
