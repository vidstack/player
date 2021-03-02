/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, event, listen, listenTo } from '@wcom/events';
import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { VdsCustomEvent } from '../shared/events';
import { isUndefined } from '../utils/unit';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import { VdsPlayerEvents } from './player.events';
import { PlayerMethods, PlayerState } from './player.types';
import { PlayerCompositeMixin } from './PlayerCompositeMixin';
import { MediaProvider } from './provider/MediaProvider';
import {
  ALL_PROVIDER_EVENT_TYPES,
  PROVIDER_EVENT_TYPE_TO_PLAYER_EVENT_MAP,
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  ProviderErrorEvent,
} from './provider/provider.events';
import {
  ALL_USER_EVENT_TYPES,
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './user/user.events';

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
 * @tagname vds-player
 *
 * @slot Used to pass in Provider/UI components.
 *
 * @csspart player: The root player container.
 *
 * @cssprop --vds-player-font-family: A custom font family to be used throughout the player.
 * @cssprop --vds-player-bg: The background color of the player.
 * @cssprop --vds-blocker-z-index: The provider UI blocker position in the root z-axis stack inside the player.
 */
export class Player
  extends PlayerCompositeMixin(LitElement)
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
  // Provider Requests
  // -------------------------------------------------------------------------------------------

  protected requestPlay(): void {
    this.makeRequest('playback', () => this.currentProvider!.play());
  }

  protected requestPause(): void {
    this.makeRequest('playback', () => this.currentProvider!.pause());
  }

  protected requestControls(isControlsVisible: boolean): void {
    this.makeRequest('ctrls', () => {
      this.currentProvider!.controls = isControlsVisible;
    });
  }

  protected requestVolumeChange(volume: number): void {
    this.makeRequest('vol', () => {
      this.currentProvider!.volume = volume;
    });
  }

  protected requestTimeChange(time: number): void {
    this.makeRequest('time', () => {
      this.currentProvider!.currentTime = time;
    });
  }

  protected requestMutedChange(muted: boolean): void {
    this.makeRequest('mute', () => {
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
  protected handleUserPlayRequest(): void {
    this.requestPlay();
  }

  @listen(UserPauseRequestEvent.TYPE)
  protected handleUserPauseRequest(): void {
    this.requestPause();
  }

  @listen(UserMutedChangeRequestEvent.TYPE)
  protected handleUserMutedChangeRequest(e: UserMutedChangeRequestEvent): void {
    this.requestMutedChange(e.detail);
  }

  @listen(UserVolumeChangeRequestEvent.TYPE)
  protected handleUserVolumeChangeRequest(
    e: UserVolumeChangeRequestEvent,
  ): void {
    this.requestVolumeChange(e.detail);
  }

  @listen(UserTimeChangeRequestEvent.TYPE)
  protected handleUserTimeChangeRequest(e: UserTimeChangeRequestEvent): void {
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
  protected catchAllProviderEvents(e: VdsCustomEvent<unknown>): void {
    if (!this.providerEventGateway(e)) return;
    this.translateProviderEventAndDispatch(e);
  }

  protected translateProviderEventAndDispatch(
    e: VdsCustomEvent<unknown>,
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

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely for documentation purposes only. The `@wcom/cli` library will pick up on these
  // and include them in any transformations such as docs. Any minifier should notice these
  // are not used and drop them.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when playback attempts to start.
   */
  @event({ name: 'vds-play' })
  protected playEvent!: VdsPlayerEvents['vds-play'];

  /**
   * Emitted when playback pauses.
   */
  @event({ name: 'vds-pause' })
  protected pauseEvent!: VdsPlayerEvents['vds-pause'];

  /**
   * Emitted when playback being playback.
   */
  @event({ name: 'vds-playing' })
  protected playingEvent!: VdsPlayerEvents['vds-playing'];

  /**
   * Emitted when the current src changes.
   */
  @event({ name: 'vds-src-change' })
  protected srcChangeEvent!: VdsPlayerEvents['vds-src-change'];

  /**
   * Emitted when the current poster changes.
   */
  @event({ name: 'vds-poster-change' })
  protected posterChangeEvent!: VdsPlayerEvents['vds-poster-change'];

  /**
   * Emitted when the muted state of the current provider changes.
   */
  @event({ name: 'vds-muted-change' })
  protected mutedChangeEvent!: VdsPlayerEvents['vds-muted-change'];

  /**
   * Emitted when the volume state of the current provider changes.
   */
  @event({ name: 'vds-volume-change' })
  protected volumeChangeEvent!: VdsPlayerEvents['vds-volume-change'];

  /**
   * Emitted when the current playback time changes.
   */
  @event({ name: 'vds-time-change' })
  protected timeChangeEvent!: VdsPlayerEvents['vds-time-change'];

  /**
   * Emitted when the length of the media changes.
   */
  @event({ name: 'vds-duration-change' })
  protected durationChangeEvent!: VdsPlayerEvents['vds-duration-change'];

  /**
   * Emitted when the length of the media downloaded changes.
   */
  @event({ name: 'vds-buffered-change' })
  protected bufferedChangeEvent!: VdsPlayerEvents['vds-buffered-change'];

  /**
   * Emitted when playback resumes/stops due to lack of data.
   */
  @event({ name: 'vds-buffering-change' })
  protected bufferingChangeEvent!: VdsPlayerEvents['vds-buffering-change'];

  /**
   * Emitted when the view type of the current provider/media changes.
   */
  @event({ name: 'vds-view-type-change' })
  protected viewTypeChangeEvent!: VdsPlayerEvents['vds-view-type-change'];

  /**
   * Emitted when the media type of the current provider/media changes.
   */
  @event({ name: 'vds-media-type-change' })
  protected mediaTypeChangeEvent!: VdsPlayerEvents['vds-media-type-change'];

  /**
   * Emitted when playback is ready to start - analgous with `canPlayThrough`.
   */
  @event({ name: 'vds-playback-ready' })
  protected playbackReadyEvent!: VdsPlayerEvents['vds-playback-ready'];

  /**
   * Emitted when playback has started (`currentTime > 0`).
   */
  @event({ name: 'vds-playback-start' })
  protected playbackStartEvent!: VdsPlayerEvents['vds-playback-start'];

  /**
   * Emitted when playback ends (`currentTime === duration`).
   */
  @event({ name: 'vds-playback-end' })
  protected playbackEndEvent!: VdsPlayerEvents['vds-playback-end'];

  /**
   * Emitted when a provider encounters an error during media loading/playback.
   */
  @event({ name: 'vds-error' })
  protected errorEvent!: VdsPlayerEvents['vds-error'];
}
