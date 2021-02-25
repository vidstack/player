/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listen, listenTo } from '@wcom/events';
import { v4 as uuid } from '@lukeed/uuid';
import {
  html,
  LitElement,
  property,
  CSSResultArray,
  TemplateResult,
  internalProperty,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import clsx from 'clsx';
import { MediaType, PlayerProps, PlayerState, ViewType } from './player.types';
import { deferredPromise, Device, isUndefined, onDeviceChange } from '../utils';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import { DeviceChangeEvent, ErrorEvent } from './player.events';
import {
  ALL_USER_EVENT_TYPES,
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './user';
import {
  ALL_PROVIDER_EVENT_TYPES,
  MediaProvider,
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  ProviderErrorEvent,
  ProviderPlaybackReadyEvent,
  ProviderViewTypeChangeEvent,
  PROVIDER_EVENT_TYPE_TO_PLAYER_EVENT_MAP,
  VdsProviderEventType,
} from './provider';
import { VdsCustomEvent } from '../shared/events';
import { PlayerContextMixin } from './PlayerContextMixin';

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
 * @fires vds-play - Emitted when playback attempts to start.
 * @fires vds-pause - Emitted when playback pauses.
 * @fires vds-playing - Emitted when playback being playback.
 * @fires vds-muted-change - Emitted when the muted state of the current provider changes.
 * @fires vds-volume-change - Emitted when the volume state of the current provider changes.
 * @fires vds-time-change - Emitted when the current playback time changes.
 * @fires vds-duration-change - Emitted when the length of the media changes.
 * @fires vds-buffered-change - Emitted when the length of the media downloaded changes.
 * @fires vds-view-type-change - Emitted when the view type of the current provider/media changes.
 * @fires vds-media-type-change - Emitted when the media type of the current provider/media changes.
 * @fires vds-ready - Emitted when the provider is ready to be interacted with.
 * @fires vds-playback-ready - Emitted when playback is ready to start - analgous with `canPlayThrough`.
 * @fires vds-playback-start - Emitted when playback has started (`currentTime > 0`).
 * @fires vds-playback-end - Emitted when playback ends (`currentTime === duration`).
 * @fires vds-device-change - Emitted when the type of user device changes between mobile/desktop.
 * @fires vds-error - Emitted when a provider encounters an error during media loading/playback.
 *
 * @slot - Used to pass in Provider/UI components.
 *
 * @csspart player - The root player container.
 *
 * @cssprop --vds-player-font-family - A custom font family to be used throughout the player.
 * @cssprop --vds-player-bg - The background color of the player.
 * @cssprop --vds-blocker-z-index - The provider UI blocker position in the root z-axis stack inside the player.
 */
export class Player
  extends PlayerContextMixin(LitElement)
  implements PlayerProps {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }

  protected readonly disposal = new Disposal();

  /**
   * -------------------------------------------------------------------------------------------
   * Lifecycle
   *
   * This section contains component lifecycle methods.
   * -------------------------------------------------------------------------------------------
   */

  connectedCallback(): void {
    super.connectedCallback();
    this.setUuid();
    this.listenToDeviceChanges();
    this.listenToUserEvents();
    this.listenToProviderEvents();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposal.empty();
    this._currentProvider = undefined;
  }

  protected setUuid(): void {
    this.context.uuidCtx = this.uuid;
    this.setAttribute('uuid', this.uuid);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Render
   *
   * This section contains methods involved in the rendering of the player.
   * -------------------------------------------------------------------------------------------
   */

  render(): TemplateResult {
    return html`
      <div
        part="player"
        aria-busy="${this.buildAriaBusy()}"
        class="${clsx(this.buildClassMap())}"
        style="${styleMap(this.buildStyleMap())}"
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

  protected buildStyleMap(): Record<string, string> {
    return {
      paddingBottom: this.isVideoView
        ? `padding-bottom: ${this.calcAspectRatio()}%;`
        : '',
    };
  }

  protected calcAspectRatio(): number {
    const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      ? this.aspectRatio.split(':')
      : [16, 9];

    return (100 / Number(width)) * Number(height);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Provider API
   *
   * This section contains logic for interacting with the current provider.
   * -------------------------------------------------------------------------------------------
   */

  @internalProperty()
  protected _currentProvider?: MediaProvider;

  /**
   * The current media provider who has connected to the player and is responsible for
   * loading media.
   */
  get currentProvider(): MediaProvider | undefined {
    return this._currentProvider;
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

  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies.
   */
  play(): Promise<void> {
    this.throwIfNoMediaProvider();
    return this.currentProvider!.play();
  }

  /**
   * Pauses playback of the media.
   */
  pause(): Promise<void> {
    this.throwIfNoMediaProvider();
    return this.currentProvider!.pause();
  }

  /**
   * Determines if the connected media provider can play the given `type`. The `type` is
   * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
   *
   * @examples
   * - `audio/mp3`
   * - `video/mp4`
   * - `video/webm; codecs="vp8, vorbis"`
   * - `/my-audio-file.mp3`
   * - `youtube/RO7VcUAsf-I`
   * - `vimeo.com/411652396`
   * - `https://www.youtube.com/watch?v=OQoz7FCWkfU`
   * - `https://media.vidstack.io/hls/index.m3u8`
   * - `https://media.vidstack.io/dash/index.mpd`
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
   */
  canPlayType(type: string): boolean {
    return this._currentProvider?.canPlayType(type) ?? false;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Device Handlers
   *
   * This section contains handler methods for I/O device changes.
   * -------------------------------------------------------------------------------------------
   */

  protected listenToDeviceChanges(): void {
    const off = onDeviceChange(this.handleDeviceChange.bind(this));
    this.disposal.add(off);
  }

  protected handleDeviceChange(device: Device): void {
    this._device = device;
    this.context.isMobileDeviceCtx = this.isMobileDevice;
    this.context.isDesktopDeviceCtx = this.isDesktopDevice;
    this.setAttribute(
      this.getMobileDeviceAttrName(),
      String(this.isMobileDevice),
    );
    this.setAttribute(
      this.getDesktopDeviceAttrName(),
      String(this.isDesktopDevice),
    );
    this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
  }

  /**
   * The name of the attribute on the player for which to set whether the current device is
   * mobile. The attribute will be set to `true`/`false` accordingly.
   */
  protected getMobileDeviceAttrName(): string {
    return 'mobile';
  }

  /**
   * The name of the attribute on the player for which to set whether the current device is
   * desktop. The attribute will be set to `true`/`false` accordingly.
   */
  protected getDesktopDeviceAttrName(): string {
    return 'desktop';
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Provider Requests
   *
   * This section contains methods responsible for requesting a state change on the current
   * provider.
   * -------------------------------------------------------------------------------------------
   */

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

  protected requestControls(isControlsVisible: PlayerState['controls']): void {
    this.attemptRequestOrQueue('ctrls', () =>
      this.currentProvider?.setControlsVisibility(isControlsVisible),
    );
  }

  protected requestVolumeChange(volume: PlayerState['volume']): void {
    this.attemptRequestOrQueue('vol', () =>
      this.currentProvider?.setVolume(volume),
    );
  }

  protected requestTimeChange(time: PlayerState['currentTime']): void {
    this.attemptRequestOrQueue('time', () =>
      this.currentProvider?.setCurrentTime(time),
    );
  }

  protected requestMutedChange(muted: PlayerState['muted']): void {
    this.attemptRequestOrQueue('mute', () =>
      this.currentProvider?.setMuted(muted),
    );
  }

  /**
   * -------------------------------------------------------------------------------------------
   * User Events
   *
   * This section is responsible for listening to user events and calling the appropriate
   * provider request method.
   *
   * @example `UserPlayRequest` --> `this.requestPlay()`.
   * -------------------------------------------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------------------------------------------
   * Provider Events
   *
   * This section is responsible for translating provider events in to player events, and
   * updating context properties.
   *
   * @example Provider --> `ProviderPlayEvent` --> Player --> `PlayEvent` --> DOM
   * -------------------------------------------------------------------------------------------
   */

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

  @listen(ProviderViewTypeChangeEvent.TYPE)
  protected handleProviderViewTypeChange(): void {
    this.setAttribute(this.getAudioViewAttrName(), String(this.isAudioView));
    this.setAttribute(this.getVideoViewAttrName(), String(this.isVideoView));
  }

  /**
   * The attribute name on the player for which to set whether the player view is of type
   * audio. This attribute will be set to `true`/`false` accordingly.
   */
  protected getAudioViewAttrName(): string {
    return 'audio';
  }

  /**
   * The attribute name on the player for which to set whether the player view is of type
   * video. This attribute will be set to `true`/`false` accordingly.
   */
  protected getVideoViewAttrName(): string {
    return 'video';
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Writable Player Properties
   *
   * This section defines writable player properties and ensures their setters call the appropriate
   * provider handler method when required.
   *
   * @example `this.paused = false` -> `this.togglePlayback(false)`.
   * -------------------------------------------------------------------------------------------
   */

  @property({ type: Number })
  get volume(): PlayerState['volume'] {
    if (!this.isPlaybackReady) return playerContext.volume.defaultValue;
    return this.currentProvider!.getVolume();
  }

  set volume(newVolume: PlayerState['volume']) {
    this.requestVolumeChange(newVolume);
  }

  // ---

  @property({ type: Number })
  get currentTime(): PlayerState['currentTime'] {
    if (!this.isPlaybackReady) return playerContext.currentTime.defaultValue;
    return this.currentProvider!.getCurrentTime();
  }

  set currentTime(newCurrentTime: PlayerState['currentTime']) {
    this.requestTimeChange(newCurrentTime);
  }

  // ---

  @property({ type: Boolean, reflect: true })
  get paused(): PlayerState['paused'] {
    if (!this.isPlaybackReady) return playerContext.paused.defaultValue;
    return this.currentProvider!.isPaused();
  }

  set paused(isPaused: PlayerState['paused']) {
    if (!isPaused) {
      this.requestPlay();
    } else {
      this.requestPause();
    }
  }

  // ---

  @property({ type: Boolean })
  get controls(): PlayerState['controls'] {
    if (!this.isPlaybackReady) return playerContext.controls.defaultValue;
    return this.currentProvider!.isControlsVisible();
  }

  set controls(isControlsVisible: PlayerState['controls']) {
    this.requestControls(isControlsVisible);
  }

  // ---

  protected _aspectRatio: PlayerState['aspectRatio'] = '16:9';

  @property({ type: String, attribute: 'aspect-ratio', reflect: true })
  get aspectRatio(): PlayerState['aspectRatio'] {
    return this._aspectRatio;
  }

  set aspectRatio(newAspectRatio: PlayerState['aspectRatio']) {
    this._aspectRatio = newAspectRatio;
    this.context.aspectRatioCtx = newAspectRatio;
  }

  // ---

  @property({ type: Boolean })
  get muted(): PlayerState['muted'] {
    if (!this.isPlaybackReady) return playerContext.muted.defaultValue;
    return this.currentProvider!.isMuted();
  }

  set muted(newMuted: PlayerState['muted']) {
    this.requestMutedChange(newMuted);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Readonly Player Properties
   *
   * This section defines readonly player properties.
   * -------------------------------------------------------------------------------------------
   */

  protected _uuid = uuid();

  get currentSrc(): PlayerState['currentSrc'] {
    if (!this.isPlaybackReady) return playerContext.currentSrc.defaultValue;
    return this.currentProvider!.getCurrentSrc();
  }

  get poster(): PlayerState['poster'] {
    if (!this.isPlaybackReady) return playerContext.poster.defaultValue;
    return this.currentProvider!.getPoster();
  }

  get uuid(): PlayerState['uuid'] {
    return this._uuid;
  }

  get duration(): PlayerState['duration'] {
    if (!this.isPlaybackReady) return playerContext.duration.defaultValue;
    return this.currentProvider!.getDuration();
  }

  get buffered(): PlayerState['buffered'] {
    if (!this.isPlaybackReady) return playerContext.buffered.defaultValue;
    return this.currentProvider!.getBuffered();
  }

  get isBuffering(): PlayerState['isBuffering'] {
    if (!this.isPlaybackReady) return playerContext.isBuffering.defaultValue;
    return this.currentProvider!.isBuffering();
  }

  get isPlaying(): PlayerState['isPlaying'] {
    if (!this.isPlaybackReady) return playerContext.isPlaying.defaultValue;
    const isPaused = this.currentProvider!.isPaused();
    return !isPaused;
  }

  protected _device = playerContext.device.defaultValue;

  get device(): PlayerState['device'] {
    return this._device;
  }

  get isMobileDevice(): PlayerState['isMobileDevice'] {
    return this._device === Device.Mobile;
  }

  get isDesktopDevice(): PlayerState['isDesktopDevice'] {
    return this._device === Device.Desktop;
  }

  get hasPlaybackStarted(): PlayerState['hasPlaybackStarted'] {
    if (!this.isPlaybackReady)
      return playerContext.hasPlaybackStarted.defaultValue;
    return this.currentProvider!.hasPlaybackStarted();
  }

  get hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
    if (!this.isPlaybackReady)
      return playerContext.hasPlaybackEnded.defaultValue;
    return this.currentProvider!.hasPlaybackEnded();
  }

  get isPlaybackReady(): PlayerState['isPlaybackReady'] {
    return (
      this.currentProvider?.isPlaybackReady?.() ??
      playerContext.isPlaybackReady.defaultValue
    );
  }

  get viewType(): PlayerState['viewType'] {
    if (!this.isPlaybackReady) return playerContext.viewType.defaultValue;
    return this.currentProvider!.getViewType();
  }

  get isAudioView(): PlayerState['isAudioView'] {
    return this.viewType === ViewType.Audio;
  }

  get isVideoView(): PlayerState['isVideoView'] {
    return this.viewType === ViewType.Video;
  }

  get mediaType(): PlayerState['mediaType'] {
    if (!this.isPlaybackReady) return playerContext.mediaType.defaultValue;
    return this.currentProvider!.getMediaType();
  }

  get isAudio(): PlayerState['isAudio'] {
    return this.mediaType === MediaType.Audio;
  }

  get isVideo(): PlayerState['isVideo'] {
    return this.mediaType === MediaType.Video;
  }
}
