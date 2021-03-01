/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listen, listenTo } from '@wcom/events';
import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { VdsCustomEvent } from '../shared';
import { deferredPromise, isUndefined } from '../utils';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import { ErrorEvent } from './player.events';
import { PlayerMethods, PlayerState } from './player.types';
import { PlayerMixin } from './PlayerMixin';
import {
  ALL_PROVIDER_EVENT_TYPES,
  MediaProvider,
  PROVIDER_EVENT_TYPE_TO_PLAYER_EVENT_MAP,
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  ProviderErrorEvent,
  ProviderPlaybackReadyEvent,
  VdsProviderEventType,
} from './provider';
import {
  ALL_USER_EVENT_TYPES,
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './user';

/**
 * The player sits at the top of the component hierarchy in the library. It encapsulates
 * Provider/UI components and acts as a message bus between them. It also provides a seamless
 * experience for interacting with any media provider through the properties/methods/events it
 * exposes.
 *
 * @example
 * ```html
 *  <vds-player>
 *    <!-- Providers here. -->
 *    <vds-ui>
 *      <!-- UI components here. -->
 *    </vds-ui>
 *  </vds-player>
 * ```
 *
 * @example
 * ```html
 *  <vds-player>
 *    <vds-youtube src="_MyD_e1jJWc"></vds-youtube>
 *    <vds-ui>
 *      <!-- UI components here. -->
 *    </vds-ui>
 *  </vds-player>
 * ```
 *
 * @event {PlayEvent} vds-play - Emitted when playback attempts to start.
 * @event {PauseEvent} vds-pause - Emitted when playback pauses.
 * @event {PlayingEvent} vds-playing - Emitted when playback being playback.
 * @event {SrcChangeEvent} vds-src-change - Emitted when the current src changes.
 * @event {PosterChangeEvent} vds-poster-change - Emitted when the current poster changes.
 * @event {MutedChangeEvent} vds-muted-change - Emitted when the muted state of the current provider changes.
 * @event {VolumeChangeEvent} vds-volume-change - Emitted when the volume state of the current provider changes.
 * @event {TimeChangeEvent} vds-time-change - Emitted when the current playback time changes.
 * @event {DurationChangeEvent} vds-duration-change - Emitted when the length of the media changes.
 * @event {BufferedChangeEvent} vds-buffered-change - Emitted when the length of the media downloaded changes.
 * @event {BufferingChangeEvent} vds-buffering-change - Emitted when playback resumes/stops due to lack of data.
 * @event {ViewTypeChangeEvent} vds-view-type-change - Emitted when the view type of the current provider/media changes.
 * @event {MediaTypeChangeEvent} vds-media-type-change - Emitted when the media type of the current provider/media changes.
 * @event {PlaybackReadyEvent} vds-playback-ready - Emitted when playback is ready to start - analgous with `canPlayThrough`.
 * @event {PlaybackStartEvent} vds-playback-start - Emitted when playback has started (`currentTime > 0`).
 * @event {PlaybackEndEvent} vds-playback-end - Emitted when playback ends (`currentTime === duration`).
 * @event {DeviceChangeEvent} vds-device-change - Emitted when the type of user device changes between mobile/desktop.
 * @event {AspectRatioChangeEvent} vds-aspect-ratio-change - Emitted when the aspect ratio changes.
 * @event {ErrorEvent} vds-error - Emitted when a provider encounters an error during media loading/playback.
 *
 * @slot - Used to pass in Provider/UI components.
 *
 * @csspart player - The root player container.
 *
 * @cssprop --vds-player-font-family - A custom font family to be used throughout the player.
 * @cssprop --vds-player-bg - The background color of the player.
 * @cssprop --vds-blocker-z-index - The provider UI blocker position in the root z-axis stack inside the player.
 *
 * @tagname vds-player
 */
export class Player
  extends PlayerMixin(LitElement)
  implements PlayerState, PlayerMethods {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }

  protected readonly disposal = new Disposal();

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();
    this.listenToUserEvents();
    this.listenToProviderEvents();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposal.empty();
    this._currentProvider = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`
      <div
        part="player"
        aria-busy="${this.buildAriaBusy()}"
        class="${clsx(this.buildClassMap())}"
      >
        ${this.renderContent()}
      </div>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected buildAriaBusy(): 'true' | 'false' {
    return this.isPlaybackReady ? 'false' : 'true';
  }

  protected buildClassMap(): Record<string, boolean> {
    return {
      player: true,
      audio: this.isAudioView,
      video: this.isVideoView,
    };
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  @internalProperty()
  protected _currentProvider?: MediaProvider;

  /**
   * The current media provider who has connected to the player and is responsible for
   * loading media.
   */
  get currentProvider(): MediaProvider | undefined {
    return this._currentProvider;
  }

  /**
   * The underlying player that is actually responsible for rendering/loading media.
   */
  get internalPlayer(): unknown {
    return this.currentProvider?.internalPlayer;
  }

  protected throwIfNoMediaProvider(): void {
    if (!isUndefined(this.currentProvider)) return;
    throw Error(
      '[PROBLEM] No media provider is currently available.\n\n' +
        '[SOLUTION] Make sure a provider has been passed into the player AND you wait for either ' +
        'the `vds-ready` or preferably the `vds-playback-ready` event to fire before accessing ' +
        'provider methods.',
    );
  }

  play(): Promise<void> {
    this.throwIfNoMediaProvider();
    return this.currentProvider!.play();
  }

  pause(): Promise<void> {
    this.throwIfNoMediaProvider();
    return this.currentProvider!.pause();
  }

  canPlayType(type: string): boolean {
    return this._currentProvider?.canPlayType(type) ?? false;
  }

  // -------------------------------------------------------------------------------------------
  // Provider Request Management
  // -------------------------------------------------------------------------------------------

  /**
   * Requests are queued if called before media is ready for playback. Once the media is
   * ready (`ProviderPlaybackReadyEvent`) the queue is flushed. Each request is associated with
   * a request key to avoid making duplicate requests of the same "type".
   */
  protected requestQueue = new Map<string, () => void | Promise<void>>();

  protected pendingRequestQueueFlush = deferredPromise();

  /**
   * Returns a clone of the current request queue for testing and/or debugging purposes.
   */
  getRequestQueue(): Map<string, () => void | Promise<void>> {
    return new Map(this.requestQueue);
  }

  /**
   * Waits for the current request queue to be flushed.
   */
  async waitForRequestQueueToFlush(): Promise<void> {
    await this.pendingRequestQueueFlush.promise;
  }

  protected async safelyMakeRequest(requestKey: string): Promise<void> {
    try {
      await this.requestQueue.get(requestKey)?.();
    } catch (e) {
      this.dispatchEvent(new ErrorEvent({ detail: e }));
    }

    this.requestQueue.delete(requestKey);
  }

  protected attemptRequestOrQueue(
    requestKey: string,
    request: () => void | Promise<void>,
  ): void {
    this.requestQueue.set(requestKey, request);
    if (!this.isPlaybackReady) return;
    this.safelyMakeRequest(requestKey);
    this.requestQueue.delete(requestKey);
  }

  protected async flushRequestQueue(): Promise<void> {
    const requests = Array.from(this.requestQueue.keys());
    await Promise.all(requests.map(reqKey => this.safelyMakeRequest(reqKey)));
    this.requestQueue.clear();
    this.pendingRequestQueueFlush.resolve();
    this.pendingRequestQueueFlush = deferredPromise();
  }

  protected requestPlay(): void {
    this.attemptRequestOrQueue('playback', () => this.currentProvider?.play());
  }

  protected requestPause(): void {
    this.attemptRequestOrQueue('playback', () => this.currentProvider?.pause());
  }

  protected requestControls(isControlsVisible: boolean): void {
    this.attemptRequestOrQueue('ctrls', () => {
      this.currentProvider!.controls = isControlsVisible;
    });
  }

  protected requestVolumeChange(volume: number): void {
    this.attemptRequestOrQueue('vol', () => {
      this.currentProvider!.volume = volume;
    });
  }

  protected requestTimeChange(time: number): void {
    this.attemptRequestOrQueue('time', () => {
      this.currentProvider!.currentTime = time;
    });
  }

  protected requestMutedChange(muted: boolean): void {
    this.attemptRequestOrQueue('mute', () => {
      this.currentProvider!.muted = muted;
    });
  }

  // -------------------------------------------------------------------------------------------
  // User Events
  // -------------------------------------------------------------------------------------------

  /**
   * Allows user events to bubble up through the player.
   */
  @property({ type: Boolean, attribute: 'allow-user-events-to-bubble' })
  allowUserEventsToBubble = false;

  protected userEventGateway(e: Event): boolean {
    if (!this.allowUserEventsToBubble) e.stopPropagation();
    return true;
  }

  protected listenToUserEvents(): void {
    ALL_USER_EVENT_TYPES.forEach(event => {
      const off = listenTo(this, event, this.catchAllUserEvents.bind(this));
      this.disposal.add(off);
    });
  }

  /**
   * This handler is attached in the "Connect" section above. Use it for processing all user
   * events.
   */
  protected catchAllUserEvents(e: VdsCustomEvent<unknown>): void {
    if (!this.userEventGateway(e)) return;
    // ...
  }

  @listen(UserPlayRequestEvent.TYPE)
  handleUserPlayRequest(): void {
    this.requestPlay();
  }

  @listen(UserPauseRequestEvent.TYPE)
  handleUserPauseRequest(): void {
    this.requestPause();
  }

  @listen(UserMutedChangeRequestEvent.TYPE)
  handleUserMutedChangeRequest(e: UserMutedChangeRequestEvent): void {
    this.requestMutedChange(e.detail);
  }

  @listen(UserVolumeChangeRequestEvent.TYPE)
  handleUserVolumeChangeRequest(e: UserVolumeChangeRequestEvent): void {
    this.requestVolumeChange(e.detail);
  }

  @listen(UserTimeChangeRequestEvent.TYPE)
  handleUserTimeChangeRequest(e: UserTimeChangeRequestEvent): void {
    this.requestTimeChange(e.detail);
  }

  // -------------------------------------------------------------------------------------------
  // Provider Events
  // -------------------------------------------------------------------------------------------

  /**
   * Allows provider events to bubble up through the player.
   */
  @property({ type: Boolean, attribute: 'allow-provider-events-to-bubble' })
  allowProviderEventsToBubble = false;

  protected providerEventGateway(e: Event): boolean {
    if (!this.allowProviderEventsToBubble) e.stopPropagation();
    return true;
  }

  protected listenToProviderEvents(): void {
    ALL_PROVIDER_EVENT_TYPES.forEach(event => {
      const off = listenTo(this, event, this.catchAllProviderEvents.bind(this));
      this.disposal.add(off);
    });
  }

  /**
   * This handler is attached in the "Connect" section above. Use it for processing all provider
   * events.
   */
  protected catchAllProviderEvents(
    e: VdsCustomEvent<unknown, VdsProviderEventType>,
  ): void {
    if (!this.providerEventGateway(e)) return;
    this.translateProviderEventAndDispatch(e);
  }

  protected translateProviderEventAndDispatch(
    e: VdsCustomEvent<unknown, VdsProviderEventType>,
  ): void {
    const PlayerEvent = PROVIDER_EVENT_TYPE_TO_PLAYER_EVENT_MAP[e.type];
    if (!isUndefined(PlayerEvent)) {
      this.dispatchEvent(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new PlayerEvent({ originalEvent: e, detail: e.detail as any }),
      );
    }
  }

  @listen(ProviderConnectEvent.TYPE)
  protected handleProviderConnect(e: ProviderConnectEvent): void {
    const connectedProvider = e.detail;
    this._currentProvider = connectedProvider;
  }

  @listen(ProviderPlaybackReadyEvent.TYPE)
  protected async handleProviderPlaybackReady(): Promise<void> {
    await this.flushRequestQueue();
  }

  @listen(ProviderDisconnectEvent.TYPE)
  protected handleProviderDisconnect(): void {
    this._currentProvider = undefined;
  }

  @listen(ProviderErrorEvent.TYPE)
  protected handleProviderError(): void {
    // TODO: handle this error.
  }

  // -------------------------------------------------------------------------------------------
  // Writable Player Properties
  // -------------------------------------------------------------------------------------------

  @property({ type: Number })
  get volume(): number {
    if (!this.isPlaybackReady) return playerContext.volume.defaultValue;
    return this.currentProvider!.volume;
  }

  set volume(newVolume: number) {
    this.requestVolumeChange(newVolume);
  }

  // ---

  @property({ type: Number, attribute: 'current-time' })
  get currentTime(): number {
    if (!this.isPlaybackReady) return playerContext.currentTime.defaultValue;
    return this.currentProvider!.currentTime;
  }

  set currentTime(newCurrentTime: number) {
    this.requestTimeChange(newCurrentTime);
  }

  // ---

  @property({ type: Boolean, reflect: true })
  get paused(): boolean {
    if (!this.isPlaybackReady) return playerContext.paused.defaultValue;
    return this.currentProvider!.paused;
  }

  set paused(isPaused: boolean) {
    if (!isPaused) {
      this.requestPlay();
    } else {
      this.requestPause();
    }
  }

  // ---

  @property({ type: Boolean })
  get controls(): boolean {
    if (!this.isPlaybackReady) return playerContext.controls.defaultValue;
    return this.currentProvider!.controls;
  }

  set controls(isControlsVisible: boolean) {
    this.requestControls(isControlsVisible);
  }

  // ---

  @property({ type: Boolean })
  get muted(): boolean {
    if (!this.isPlaybackReady) return playerContext.muted.defaultValue;
    return this.currentProvider!.muted;
  }

  set muted(newMuted: boolean) {
    this.requestMutedChange(newMuted);
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Player Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): string {
    if (!this.isPlaybackReady) return playerContext.currentSrc.defaultValue;
    return this.currentProvider!.currentSrc;
  }

  get currentPoster(): string {
    if (!this.isPlaybackReady) return playerContext.currentPoster.defaultValue;
    return this.currentProvider!.currentPoster;
  }

  get duration(): number {
    if (!this.isPlaybackReady) return playerContext.duration.defaultValue;
    return this.currentProvider!.duration;
  }

  get buffered(): number {
    if (!this.isPlaybackReady) return playerContext.buffered.defaultValue;
    return this.currentProvider!.buffered;
  }

  get isBuffering(): boolean {
    if (!this.isPlaybackReady) return playerContext.isBuffering.defaultValue;
    return this.currentProvider!.isBuffering;
  }

  get isPlaying(): boolean {
    if (!this.isPlaybackReady) return playerContext.isPlaying.defaultValue;
    const isPaused = this.currentProvider!.paused;
    return !isPaused;
  }

  get hasPlaybackStarted(): boolean {
    if (!this.isPlaybackReady)
      return playerContext.hasPlaybackStarted.defaultValue;
    return this.currentProvider!.hasPlaybackStarted;
  }

  get hasPlaybackEnded(): boolean {
    if (!this.isPlaybackReady)
      return playerContext.hasPlaybackEnded.defaultValue;
    return this.currentProvider!.hasPlaybackEnded;
  }

  get isPlaybackReady(): boolean {
    return (
      this.currentProvider?.isPlaybackReady ??
      playerContext.isPlaybackReady.defaultValue
    );
  }
}
