import {
  contextRecordProvider,
  DerivedContext,
  provideContextRecord,
} from '@wcom/context';
import { Disposal, listen, listenTo } from '@wcom/events';
import fscreen from 'fscreen';
import { LitElement, property, PropertyValues } from 'lit-element';

import { Unsubscribe } from '../../shared/types';
import { raf } from '../../utils/dom';
import { areNumbersRoughlyEqual } from '../../utils/number';
import { deferredPromise } from '../../utils/promise';
import { canOrientScreen } from '../../utils/support';
import { isString, isUndefined, noop } from '../../utils/unit';
import { CanPlay } from '../CanPlay';
import { MediaType } from '../MediaType';
import {
  PlayerContext,
  playerContext,
  PlayerContextProvider,
  transformContextName,
} from '../player.context';
import {
  VdsCanPlayEvent,
  VdsConnectEvent,
  VdsDisconnectEvent,
  VdsEndedEvent,
  VdsErrorEvent,
  VdsFullscreenChangeEvent,
  VdsViewTypeChangeEvent,
} from '../player.events';
import { PlayerMethods, PlayerProps } from '../player.types';
import { ScreenOrientation, ScreenOrientationLock } from '../ScreenOrientation';
import {
  VdsUserFullscreenChangeEvent,
  VdsUserMutedChangeEvent,
  VdsUserPauseEvent,
  VdsUserPlayEvent,
  VdsUserSeekedEvent,
  VdsUserVolumeChangeEvent,
} from '../user/user.events';
import { UuidMixin } from '../uuid/UuidMixin';
import { ViewType } from '../ViewType';
import { ProviderProps } from './provider.args';
import {
  ProviderRequestAction,
  ProviderRequestKey,
  ProviderRequestQueue,
} from './provider.types';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 */
@provideContextRecord(playerContext, transformContextName)
export abstract class MediaProvider<EngineType = unknown>
  extends UuidMixin(LitElement)
  implements PlayerProps, PlayerMethods, ProviderProps {
  connectedCallback(): void {
    super.connectedCallback();
    this.initScreenOrientation();
    this.initFullscreen();
    this.dispatchEvent(new VdsConnectEvent({ detail: this }));
  }

  updated(changedProperties: PropertyValues): void {
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

    if (changedProperties.has('aspectRatio')) {
      this.context.aspectRatio = this.aspectRatio;
    }

    super.updated(changedProperties);
  }

  disconnectedCallback(): void {
    this.destroyScreenOrientation();
    this.destroyFullscreen();
    this.resetRequestQueue();
    this.hardResetContext();
    this.context.viewType = ViewType.Unknown;
    this.dispatchEvent(
      new VdsViewTypeChangeEvent({ detail: ViewType.Unknown }),
    );
    this.dispatchEvent(new VdsDisconnectEvent({ detail: this }));
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Writable Properties
  // -------------------------------------------------------------------------------------------

  @property({ type: Number })
  get volume(): number {
    return this.canPlay ? this.getVolume() : 1;
  }

  set volume(requestedVolume: number) {
    this.makeRequest('volume', () => {
      this.setVolume(requestedVolume);
    });
  }

  protected abstract getVolume(): number;
  protected abstract setVolume(newVolume: number): void;

  // ---

  @property({ type: Boolean })
  get paused(): boolean {
    return this.canPlay ? this.getPaused() : true;
  }

  set paused(shouldPause: boolean) {
    this.makeRequest('paused', () => {
      if (!shouldPause) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  protected abstract getPaused(): boolean;

  // ---

  @property({ type: Number, attribute: 'current-time' })
  get currentTime(): number {
    return this.canPlay ? this.getCurrentTime() : 0;
  }

  set currentTime(requestedTime: number) {
    this.makeRequest('time', () => {
      this.setCurrentTime(requestedTime);
    });
  }

  protected abstract getCurrentTime(): number;
  protected abstract setCurrentTime(newTime: number): void;

  // ---

  @property({ type: Boolean })
  get muted(): boolean {
    return this.canPlay ? this.getMuted() : false;
  }

  set muted(shouldMute: boolean) {
    this.makeRequest('muted', () => {
      this.setMuted(shouldMute);
    });
  }

  protected abstract getMuted(): boolean;
  protected abstract setMuted(isMuted: boolean): void;

  // ---

  @property({ type: Boolean })
  autoplay = false;

  // ---

  @property({ type: Boolean })
  controls = false;

  // ---

  @property({ type: Boolean })
  playsinline = false;

  // ---

  @property({ type: Boolean })
  loop = false;

  // ---

  @property({ attribute: 'aspect-ratio' }) aspectRatio:
    | string
    | undefined = undefined;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying engine that is actually responsible for rendering/loading media. Some examples
   * are:
   *
   * - `VideProvider` engine is `HTMLMediaElement`.
   * - `YoutubeProvider` engine is `HTMLIFrameElement`.
   * - `HLSProvider` engine is the `Hls.js` instance.
   *
   * Refer to the respective provider documentation to find out which engine is powering it.
   */
  abstract readonly engine: EngineType;

  get buffered(): TimeRanges {
    return this.context.buffered;
  }

  get canPlay(): boolean {
    return this.context.canPlay;
  }

  get canPlayThrough(): boolean {
    return this.context.canPlayThrough;
  }

  get currentPoster(): string {
    return this.context.currentPoster;
  }

  get currentSrc(): string {
    return this.context.currentSrc;
  }

  get duration(): number {
    return this.context.duration;
  }

  get ended(): boolean {
    return this.context.ended;
  }

  get mediaType(): MediaType {
    return this.context.mediaType;
  }

  get played(): TimeRanges {
    return this.context.played;
  }

  get playing(): boolean {
    return this.context.playing;
  }

  get seekable(): TimeRanges {
    return this.context.seekable;
  }

  get seeking(): boolean {
    return this.context.seeking;
  }

  get started(): boolean {
    return this.context.started;
  }

  get viewType(): ViewType {
    return this.context.viewType;
  }

  get waiting(): boolean {
    return this.context.waiting;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  abstract canPlayType(type: string): CanPlay;

  shouldPlayType(type: string): boolean {
    const canPlayType = this.canPlayType(type);
    return canPlayType === CanPlay.Maybe || canPlayType === CanPlay.Probably;
  }

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;

  protected throwIfNotReadyForPlayback(): void {
    if (!this.canPlay) {
      throw Error(
        `Media is not ready - wait for \`${VdsCanPlayEvent.TYPE}\` event.`,
      );
    }
  }

  protected hasPlaybackRoughlyEnded(): boolean {
    return areNumbersRoughlyEqual(this.currentTime, this.duration, 3);
  }

  /**
   * Call if you suspect that playback might have resumed/ended again.
   */
  protected validatePlaybackEndedState(): void {
    if (this.context.ended && !this.hasPlaybackRoughlyEnded()) {
      this.context.ended = false;
    } else if (!this.context.ended && this.hasPlaybackRoughlyEnded()) {
      this.context.ended = true;
      this.dispatchEvent(new VdsEndedEvent());
    }
  }

  protected async resetPlayback(): Promise<void> {
    this.context.currentTime = 0;
    this.context.ended = false;
    this.setCurrentTime(0);
    // Give the browser a moment to re-paint and recalibrate media engine.
    await raf();
  }

  protected async resetPlaybackIfEnded(): Promise<void> {
    if (!this.hasPlaybackRoughlyEnded()) return;
    return this.resetPlayback();
  }

  // -------------------------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------------------------

  protected getAriaBusy(): 'true' | 'false' {
    return this.canPlay ? 'false' : 'true';
  }

  protected calcAspectRatio(): number {
    if (
      !isString(this.aspectRatio) ||
      !/\d{1,2}:\d{1,2}/.test(this.aspectRatio)
    )
      return NaN;

    const [width, height] = this.aspectRatio.split(':');

    return (100 / Number(width)) * Number(height);
  }

  protected getAspectRatioPadding(minPadding = '98vh'): string {
    const ratio = this.calcAspectRatio();
    if (isNaN(ratio)) return '';
    return `min(${minPadding}, ${this.calcAspectRatio()}%)`;
  }

  protected throwIfNotVideoView(): void {
    if (!this.context.isVideoView) {
      throw Error('Player is currently not in a video view.');
    }
  }

  // -------------------------------------------------------------------------------------------
  // User Event Handlers
  // -------------------------------------------------------------------------------------------

  /**
   * Allows user events to bubble up through the player.
   */
  @property({ type: Boolean, attribute: 'allow-user-events-to-bubble' })
  allowUserEventsToBubble = false;

  protected userEventGateway(e: Event): void {
    if (!this.allowUserEventsToBubble) e.stopPropagation();
  }

  @listen(VdsUserMutedChangeEvent.TYPE)
  protected handleUserMuteChange(e: VdsUserMutedChangeEvent): void {
    this.userEventGateway(e);
    this.muted = e.detail;
  }

  @listen(VdsUserFullscreenChangeEvent.TYPE)
  protected async handleUserFullscreenChange(
    e: VdsUserFullscreenChangeEvent,
  ): Promise<void> {
    this.userEventGateway(e);
    const shouldEnterFullscreen = e.detail;
    this.makeRequest('fullscreen', async () => {
      if (shouldEnterFullscreen) {
        await this.requestFullscreen();
      } else {
        await this.exitFullscreen();
      }
    });
  }

  @listen(VdsUserPlayEvent.TYPE)
  protected handleUserPlay(e: VdsUserPlayEvent): void {
    this.userEventGateway(e);
    this.paused = false;
  }

  @listen(VdsUserPauseEvent.TYPE)
  protected handleUserPause(e: VdsUserPauseEvent): void {
    this.userEventGateway(e);
    this.paused = true;
  }

  @listen(VdsUserSeekedEvent.TYPE)
  protected handleUserSeeked(e: VdsUserSeekedEvent): void {
    this.userEventGateway(e);
    this.currentTime = e.detail;
  }

  @listen(VdsUserVolumeChangeEvent.TYPE)
  protected handleUserVolumeChange(e: VdsUserVolumeChangeEvent): void {
    this.userEventGateway(e);
    this.volume = e.detail;
  }

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  protected screenOrientationDisposal = new Disposal();

  get screenOrientation(): ScreenOrientation | undefined {
    return this.canOrientScreen
      ? (screen.orientation.type as ScreenOrientation)
      : undefined;
  }

  get screenOrientationLocked(): boolean {
    return this.context.screenOrientationLocked;
  }

  get canOrientScreen(): boolean {
    return canOrientScreen();
  }

  protected initScreenOrientation(): void {
    this.context.canOrientScreen = this.canOrientScreen;
    if (!this.canOrientScreen) return;
    this.screenOrientationDisposal.add(
      this.addScreenOrientationChangeEventListener(
        this.handleOrientationChange.bind(this),
      ),
    );
  }

  protected destroyScreenOrientation(): void {
    if (!this.canOrientScreen) return;
    this.screenOrientationDisposal.empty();
  }

  protected addScreenOrientationChangeEventListener(
    handler: (this: ScreenOrientation, event: Event) => void,
  ): Unsubscribe {
    return listenTo(screen.orientation, 'change', handler);
  }

  protected handleOrientationChange(): void {
    this.context.screenOrientation = this.screenOrientation;
  }

  async lockOrientation(lockType: ScreenOrientationLock): Promise<void> {
    this.throwIfScreenOrientationUnavailable();
    const response = await screen.orientation.lock(lockType);
    this.context.screenOrientationLocked = true;
    return response;
  }

  async unlockOrientation(): Promise<void> {
    this.throwIfScreenOrientationUnavailable();
    const response = await screen.orientation.unlock();
    this.context.screenOrientationLocked = false;
    return response;
  }

  protected throwIfScreenOrientationUnavailable(): void {
    if (!this.canOrientScreen) {
      throw Error('Screen orientation API is not available.');
    }
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  @property({ attribute: 'fullscreen-orientation' })
  fullscreenOrientation?: ScreenOrientationLock;

  protected fullscreenDisposal = new Disposal();

  get canRequestFullscreen(): boolean {
    return this.context.isVideoView && this.canRequestFullscreenNatively;
  }

  /**
   * Whether the native fullscreen API is enabled.
   */
  get canRequestFullscreenNatively(): boolean {
    return fscreen.fullscreenEnabled;
  }

  get fullscreen(): boolean {
    return this.isNativeFullscreenActive;
  }

  /**
   * Whether the player is in fullscreen mode via the native Fullscreen API.
   */
  get isNativeFullscreenActive(): boolean {
    return (
      fscreen.fullscreenElement === this ||
      this.matches(
        // Property `fullscreenPseudoClass` is missing from `@types/fscreen`.
        ((fscreen as unknown) as { fullscreenPseudoClass: string })
          .fullscreenPseudoClass,
      )
    );
  }

  // Listening to ourselves here to keep state in-sync.
  @listen(VdsViewTypeChangeEvent.TYPE)
  protected initFullscreen(): void {
    this.context.canRequestFullscreen =
      this.context.isVideoView && this.canRequestFullscreen;
  }

  protected destroyFullscreen(): void {
    if (!this.canRequestFullscreen) return;
    if (this.fullscreen) this.exitFullscreen();
    this.fullscreenDisposal.empty();
  }

  protected addFullscreenChangeEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): Unsubscribe {
    if (!this.canRequestFullscreen) return noop;
    return listenTo(
      (fscreen as unknown) as EventTarget,
      'fullscreenchange',
      handler,
    );
  }

  protected addFullscreenErrorEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): Unsubscribe {
    if (!this.canRequestFullscreen) return noop;
    return listenTo(
      (fscreen as unknown) as EventTarget,
      'fullscreenerror',
      handler,
    );
  }

  async requestFullscreen(): Promise<void> {
    if (this.isRequestingFullscreen) {
      return super.requestFullscreen();
    }

    this.throwIfNoFullscreenSupport();
    if (this.fullscreen) return;

    // TODO: Check if PiP is active, if so make sure to exit.

    this.fullscreenDisposal.add(
      this.addFullscreenChangeEventListener(
        this.handleFullscreenChange.bind(this),
      ),
    );

    this.fullscreenDisposal.add(
      this.addFullscreenErrorEventListener(
        this.handleFullscreenError.bind(this),
      ),
    );

    const response = await this.makeEnterFullscreenRequest();
    await this.lockFullscreenOrientation();
    return response;
  }

  // Ye... find a better way later.
  protected isRequestingFullscreen = false;

  protected async makeEnterFullscreenRequest(): Promise<void> {
    this.isRequestingFullscreen = true;
    const response = await fscreen.requestFullscreen(this);
    this.isRequestingFullscreen = false;
    return response;
  }

  protected async lockFullscreenOrientation(): Promise<void> {
    if (!this.canOrientScreen || isUndefined(this.fullscreenOrientation)) {
      return;
    }

    try {
      await this.lockOrientation(this.fullscreenOrientation);
    } catch (e) {
      this.dispatchEvent(new VdsErrorEvent({ detail: e }));
    }
  }

  async exitFullscreen(): Promise<void> {
    this.throwIfNoFullscreenSupport();
    if (!this.fullscreen) return;
    const response = await this.makeExitFullscreenRequest();
    await this.unlockFullscreenOrientation();
    return response;
  }

  protected async makeExitFullscreenRequest(): Promise<void> {
    return fscreen.exitFullscreen();
  }

  protected async unlockFullscreenOrientation(): Promise<void> {
    if (!this.canOrientScreen || isUndefined(this.fullscreenOrientation)) {
      return;
    }

    try {
      await this.unlockOrientation();
    } catch (e) {
      this.dispatchEvent(new VdsErrorEvent({ detail: e }));
    }

    this.context.screenOrientationLocked = false;
  }

  protected handleFullscreenChange(originalEvent: Event): void {
    const isActive = this.fullscreen;
    this.context.fullscreen = isActive;
    if (!isActive) this.fullscreenDisposal.empty();
    this.dispatchEvent(
      new VdsFullscreenChangeEvent({
        detail: isActive,
        originalEvent,
      }),
    );
  }

  protected handleFullscreenError(event: Event): void {
    this.dispatchEvent(new VdsErrorEvent({ detail: event }));
  }

  protected throwIfNoFullscreenSupport(): void {
    this.throwIfNotVideoView();
    if (!this.canRequestFullscreenNatively) {
      throw Error(
        'Fullscreen API is not enabled or supported in this environment.',
      );
    }
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Requests are queued if called before media is ready for playback. Once the media is
   * ready (`VdsCanPlayEvent`) the queue is flushed. Each request is associated with
   * a request key to avoid making duplicate requests of the same "type".
   */
  protected requestQueue: ProviderRequestQueue = new Map();

  protected pendingRequestQueueFlush = deferredPromise();

  /**
   * Returns a clone of the current request queue.
   */
  getRequestQueue(): ProviderRequestQueue {
    return new Map(this.requestQueue);
  }

  /**
   * Waits for the current request queue to be flushed.
   */
  async waitForRequestQueueToFlush(): Promise<void> {
    if (this.canPlay) return;
    await this.pendingRequestQueueFlush.promise;
  }

  protected async safelyMakeRequest(
    requestKey: ProviderRequestKey,
  ): Promise<void> {
    try {
      await this.requestQueue.get(requestKey)?.();
    } catch (e) {
      this.dispatchEvent(new VdsErrorEvent({ detail: e }));
    }

    this.requestQueue.delete(requestKey);
    this.requestUpdate();
  }

  /**
   * This method will attempt to make a request if the current provider is ready
   * for playback, otherwise it'll queue the request to be fulfilled when the
   * `VdsCanPlayEvent` is fired.
   *
   * @param requestKey - A unique key to identify the request.
   * @param action - The action to be performed when the request is fulfilled.
   */
  protected makeRequest(
    requestKey: ProviderRequestKey,
    request: ProviderRequestAction,
  ): void {
    this.requestQueue.set(requestKey, request);

    if (!this.canPlay) return;

    this.safelyMakeRequest(requestKey);
    this.requestQueue.delete(requestKey);
  }

  protected async flushRequestQueue(): Promise<void> {
    const requests = Array.from(this.requestQueue.keys());
    await Promise.all(requests.map(reqKey => this.safelyMakeRequest(reqKey)));
    this.requestQueue.clear();
    this.pendingRequestQueueFlush.resolve();
  }

  protected resetRequestQueue(): void {
    this.requestQueue.clear();
    // Release anyone waiting.
    this.pendingRequestQueueFlush.resolve();
    this.pendingRequestQueueFlush = deferredPromise();
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * Player context record. Any property updated inside this object will trigger a context
   * update.
   *
   * @internal - Used internally to keep `MediaProvider` and UI in sync with engine state. Exposed
   * for testing.
   */
  @contextRecordProvider(playerContext, transformContextName)
  readonly context!: PlayerContextProvider;

  /**
   * Context properties that should be reset when media is changed.
   */
  protected softResettableCtxProps = new Set<keyof PlayerContext>([
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
    'started',
    'waiting',
  ]);

  /**
   * When the `currentSrc` is changed this method is called to update any context properties
   * that need to be reset. Important to note that not all properties are reset, only the
   * properties in the `softResettableCtxProps` set.
   */
  protected softResetContext(): void {
    Object.keys(playerContext).forEach(prop => {
      if (this.softResettableCtxProps.has(prop)) {
        this.context[prop] = playerContext[prop].defaultValue;
      }
    });
  }

  /**
   * Called when the provider disconnects, resets the player context completely.
   */
  protected hardResetContext(): void {
    Object.keys(playerContext).forEach(prop => {
      // We can't set values on a derived context.
      if (isUndefined((playerContext[prop] as DerivedContext<unknown>).key)) {
        this.context[prop] = playerContext[prop].defaultValue;
      }
    });
  }
}
