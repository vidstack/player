/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listenTo } from '@wcom/events';
import { v4 as uuid } from '@lukeed/uuid';
import {
  html,
  LitElement,
  property,
  CSSResultArray,
  TemplateResult,
  internalProperty,
  PropertyValues,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import clsx from 'clsx';
import {
  MediaType,
  PlayerProps,
  PlayerState,
  Source,
  ViewType,
} from './player.types';
import { Device, isString, isUndefined, onDeviceChange } from '../utils';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import {
  ReadyEvent,
  TimeChangeEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
  ErrorEvent,
  BootStartEvent,
  BootEndEvent,
  BufferedChangeEvent,
  BufferingChangeEvent,
  DurationChangeEvent,
  MediaTypeChangeEvent,
  DeviceChangeEvent,
  MutedChangeEvent,
  PauseEvent,
  PlaybackEndEvent,
  PlaybackReadyEvent,
  PlaybackStartEvent,
  PlayEvent,
  PlayingEvent,
} from './player.events';
import {
  ALL_USER_EVENTS,
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './user';
import {
  ALL_PROVIDER_EVENTS,
  MediaProvider,
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  ProviderDurationChangeEvent,
  ProviderErrorEvent,
  ProviderMediaTypeChangeEvent,
  ProviderMutedChangeEvent,
  ProviderPauseEvent,
  ProviderPlaybackEndEvent,
  ProviderPlaybackReadyEvent,
  ProviderPlaybackStartEvent,
  ProviderPlayEvent,
  ProviderPlayingEvent,
  ProviderReadyEvent,
  ProviderTimeChangeEvent,
  ProviderViewTypeChangeEvent,
  ProviderVolumeChangeEvent,
} from './provider';
import { VdsCustomEvent, VdsCustomEventConstructor } from '../shared/events';
import {
  Bootable,
  BootStrategy,
  LazyBootStrategy,
  BootStrategyFactory,
} from './strategies/boot';

/**
 * The player sits at the top of the component hierarchy in the library. It encapsulates
 * Provider/UI components and acts as a message bus between them. It also provides a seamless
 * experience for interacting with any media provider through the properties/methods/events it
 * exposes.
 *
 * The player accepts any number of providers to be passed in through the default `<slot />`. The
 * current `MediaLoadStrategy` will determine which provider to load. You can pass in a
 * custom strategy if desired, by default it'll load the first media provider who can
 * play the current `src`.
 *
 * @example
 * ```html
 *  <vds-player>
 *    <!-- Providers here. -->
 *    <vds-ui>
 *      <!-- UI components here. -->
 *    </vds-ui>
 *    <div slot="booting">
 *      <!-- Rendered while player is booting. -->
 *    </div>
 *  </vds-player>
 * ```
 *
 * @example
 * ```html
 *  <vds-player src="youtube/_MyD_e1jJWc">
 *    <vds-hls></vds-hls>
 *    <vds-youtube></vds-youtube>
 *    <vds-video preload="metadata"></vds-video>
 *    <vds-ui>
 *      <!-- UI components here. -->
 *    </vds-ui>
 *  </vds-player>
 * ```
 *
 * @fires vds-boot-start - Emitted when the player begins booting.
 * @fires vds-boot-end - Emitted when the player has booted.
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
export class Player extends LitElement implements PlayerProps, Bootable {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }

  protected disposal = new Disposal();

  connectedCallback(): void {
    super.connectedCallback();
    this.connect();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disconnect();
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Render
   *
   * This section contains methods involved in the rendering of the player.
   * -------------------------------------------------------------------------------------------
   */

  render(): TemplateResult {
    const isAriaBusy = this.isPlaybackReady ? 'false' : 'true';

    const classes = {
      player: true,
      audio: this.isAudioView,
      video: this.isVideoView,
    };

    const styles = {
      paddingBottom: `padding-bottom: ${this.calcAspectRatio()}%;`,
    };

    return html`
      <div
        part="player"
        aria-busy="${isAriaBusy}"
        class="${clsx(classes)}"
        style="${styleMap(styles)}"
      >
        ${this.renderProviderUIBlocker()} ${this.renderBooting()}
        <slot></slot>
      </div>
    `;
  }

  protected renderProviderUIBlocker(): TemplateResult | undefined {
    // TODO: should have check for custom controls otherwise it'll block chromeless native player.
    const isProviderUIBlockerVisible = this.isVideoView && !this.controls;

    return isProviderUIBlockerVisible
      ? html`<div class="provider-ui-blocker"></div>`
      : undefined;
  }

  protected renderBooting(): TemplateResult | undefined {
    if (this.hasBooted) {
      return undefined;
    }

    return !isUndefined(this.bootStrategy.renderWhileBooting)
      ? this.bootStrategy.renderWhileBooting()
      : html`<slot name="booting"></slot>`;
  }

  protected calcAspectRatio(): number {
    // TODO: throw error or log if invalid aspect ratio.
    const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      ? this.aspectRatio.split(':')
      : [16, 9];

    return (100 / Number(width)) * Number(height);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Boot
   *
   * This section contains props/methods involved in the booting of the player.
   * -------------------------------------------------------------------------------------------
   */

  /**
   * A `BootStrategy` determines when the player should begin rendering the current provider and
   * loading media.
   */
  @property({
    type: String,
    attribute: 'boot-strategy',
    converter: {
      fromAttribute(value) {
        return isString(value) && BootStrategyFactory.isValidType(value)
          ? BootStrategyFactory.build(value)
          : BootStrategyFactory.buildLazyBootStrategy();
      },
    },
  })
  bootStrategy: BootStrategy = new LazyBootStrategy();

  /**
   * An artificial delay in milliseconds before the player boots. Use this if you'd like to
   * extend showing the boot screen.
   */
  @property({ type: Number, attribute: 'boot-delay' })
  bootDelay = 0;

  @internalProperty()
  protected _hasBooted = false;

  get hasBooted(): boolean {
    return this._hasBooted;
  }

  /**
   * Part of the `Bootable` interface.
   */
  get bootTarget(): HTMLElement {
    return this;
  }

  /**
   * This method is called by the current `BootStrategy` when it's time to boot. Part of the
   * `Bootable` interface.
   */
  async boot(): Promise<void> {
    if (this._hasBooted) return;

    setTimeout(async () => {
      this._hasBooted = true;
      this.setAttribute(this.getBootedAttrName(), 'true');
      await this.updateComplete;
      this.dispatchEvent(new BootEndEvent());
      this.loadMedia();
    }, this.bootDelay);
  }

  protected getBootedAttrName(): string {
    return 'booted';
  }

  protected previousBootStrategy: BootStrategy | undefined;

  protected handleBootStrategyChange(): void {
    this.destroyBootStrategy();
    this.bootStrategy.register(this);
    this.dispatchEvent(new BootStartEvent());
    this.previousBootStrategy = this.bootStrategy;
  }

  protected destroyBootStrategy(): void {
    this._hasBooted = false;
    this.setAttribute(this.getBootedAttrName(), 'false');
    this.previousBootStrategy?.destroy();
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Provider Management.
   *
   * This section contains logic for managing providers.
   * -------------------------------------------------------------------------------------------
   */

  @internalProperty()
  protected _currentProvider?: MediaProvider;

  /**
   * The current media provider.
   */
  get currentProvider(): MediaProvider | undefined {
    return this._currentProvider;
  }

  protected mediaProviders = new Set<MediaProvider>();

  // Called when a provider connects/disconnects via events (see the 'Provider Events' section).
  protected async handleMediaProviderSetChange(): Promise<void> {
    this.loadMedia();
  }

  protected async updateCurrentProvider(): Promise<void> {
    const newProvider = Array.from(this.mediaProviders).find(provider =>
      provider.canPlayType(this.src),
    );

    if (this._currentProvider === newProvider) return;

    await this._currentProvider?.destroy();
    await this._currentProvider?.updateComplete;

    this._currentProvider = newProvider;
    await this._currentProvider?.init();
    await this._currentProvider?.updateComplete;

    // Trigger re-render to update rendering of provider.
    await this.requestUpdate();
  }

  protected throwIfNoMediaProvider(): void {
    if (!isUndefined(this.currentProvider)) return;
    throw Error('No media provider is currently available.');
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
   * Determines if any connected media provider can play the given `type`. The `type` is
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
    return Array.from(this.mediaProviders).some(provider =>
      provider.canPlayType(type),
    );
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Media Management
   *
   * This section contains logic for managing media.
   * -------------------------------------------------------------------------------------------
   */

  protected currentlyLoadedSrc?: Source;

  /**
   * Checks:
   * - Has the player booted?
   * - Has the media already loaded?
   * - Has the provider changed?
   * - Does the new/old current provider still exist?
   * - Is the current provider ready?
   */
  protected async loadMedia(): Promise<void> {
    const hasAlreadyLoaded = this.src === this.currentlyLoadedSrc;
    if (!this.hasBooted || hasAlreadyLoaded) return;
    this.updateCurrentProvider();
    if (!this.currentProvider?.isReady()) return;
    this.currentProvider!.setPoster(this.poster);
    await this.currentProvider!.loadMedia(this.src);
    this.currentlyLoadedSrc = this.src;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Lifecycle
   *
   * This section contains component lifecycle methods.
   * -------------------------------------------------------------------------------------------
   */

  protected connect(): void {
    this.setUuid();
    this.listenToDeviceChanges();
    this.listenToUserEvents();
    this.listenToProviderEvents();
  }

  protected disconnect(): void {
    this.disposal.empty();
    this.destroyBootStrategy();
    this._currentProvider = undefined;
    this.currentlyLoadedSrc = undefined;
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('bootStrategy')) {
      this.handleBootStrategyChange();
    }
  }

  protected setUuid(): void {
    this.uuidCtx = this.uuid;
    this.setAttribute('uuid', this.uuid);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Listeners
   *
   * This section contains methods involved in setting up any event listeners.
   * -------------------------------------------------------------------------------------------
   */

  protected listenToDeviceChanges(): void {
    const off = onDeviceChange(this.handleDeviceChange.bind(this));
    this.disposal.add(off);
  }

  protected listenToUserEvents(): void {
    ALL_USER_EVENTS.forEach(event => {
      const off = listenTo(this, event.TYPE, this.handleUserEvent.bind(this));
      this.disposal.add(off);
    });
  }

  protected listenToProviderEvents(): void {
    ALL_PROVIDER_EVENTS.forEach(event => {
      const off = listenTo(
        this,
        event.TYPE,
        this.handleProviderEvent.bind(this),
      );
      this.disposal.add(off);
    });
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Device Handlers
   *
   * This section contains handler methods for I/O device changes.
   * -------------------------------------------------------------------------------------------
   */

  protected handleDeviceChange(device: Device): void {
    this._device = device;
    this.isMobileDeviceCtx = this.isMobileDevice;
    this.isDesktopDeviceCtx = this.isDesktopDevice;
    this.setAttribute(this.getMobileAttrName(), String(this.isMobileDevice));
    this.setAttribute(this.getDesktopAttrName(), String(this.isDesktopDevice));
    this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
  }

  protected getMobileAttrName(): string {
    return 'mobile';
  }

  protected getDesktopAttrName(): string {
    return 'desktop';
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

  protected _src: PlayerState['src'] = '';

  @property({ type: String })
  get src(): PlayerState['src'] {
    return this._src;
  }

  set src(newSrc: PlayerState['src']) {
    this._src = newSrc;
    this.srcCtx = newSrc;
    this.loadMedia();
  }

  // ---

  @property({ type: Number })
  get volume(): PlayerState['volume'] {
    return this.currentProvider?.getVolume() ?? 0.3;
  }

  set volume(newVolume: PlayerState['volume']) {
    this.requestVolumeChange(newVolume);
  }

  // ---

  @property({ type: Number })
  get currentTime(): PlayerState['currentTime'] {
    return this.currentProvider?.getCurrentTime() ?? 0;
  }

  set currentTime(newCurrentTime: PlayerState['currentTime']) {
    this.requestTimeChange(newCurrentTime);
  }

  // ---

  @property({ type: Boolean, reflect: true })
  get paused(): PlayerState['paused'] {
    return this.currentProvider?.isPaused() ?? true;
  }

  set paused(newPaused: PlayerState['paused']) {
    this.requestPlaybackChange(newPaused);
  }

  // ---

  @property({ type: Boolean })
  get controls(): PlayerState['controls'] {
    return this.currentProvider?.isControlsVisible() ?? false;
  }

  set controls(isControlsVisible: PlayerState['controls']) {
    this.requestControls(isControlsVisible);
  }

  // ---

  @property({ type: String })
  get poster(): PlayerState['poster'] {
    return this.currentProvider?.getPoster();
  }

  set poster(newPoster: PlayerState['poster']) {
    this.requestPosterChange(newPoster);
  }

  // ---

  protected _aspectRatio: PlayerState['aspectRatio'] = '16:9';

  @property({ type: String, attribute: 'aspect-ratio', reflect: true })
  get aspectRatio(): PlayerState['aspectRatio'] {
    return this._aspectRatio;
  }

  set aspectRatio(newAspectRatio: PlayerState['aspectRatio']) {
    this._aspectRatio = newAspectRatio;
    this.aspectRatioCtx = newAspectRatio;
  }

  // ---

  @property({ type: Boolean })
  get muted(): PlayerState['muted'] {
    return this.currentProvider?.isMuted() ?? false;
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

  get uuid(): PlayerState['uuid'] {
    return this._uuid;
  }

  get duration(): PlayerState['duration'] {
    return this.currentProvider?.getDuration() ?? -1;
  }

  get buffered(): PlayerState['buffered'] {
    return this.currentProvider?.getBuffered() ?? 0;
  }

  get isBuffering(): PlayerState['isBuffering'] {
    return this.currentProvider?.isBuffering() ?? false;
  }

  get isPlaying(): PlayerState['isPlaying'] {
    const isPaused = this.currentProvider?.isPaused() ?? true;
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
    return this.currentProvider?.hasPlaybackStarted() ?? false;
  }

  get hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
    return this.currentProvider?.hasPlaybackEnded() ?? false;
  }

  get isProviderReady(): PlayerState['isProviderReady'] {
    return this.currentProvider?.isReady() ?? false;
  }

  get isPlaybackReady(): PlayerState['isPlaybackReady'] {
    return this.currentProvider?.isPlaybackReady() ?? false;
  }

  get viewType(): PlayerState['viewType'] {
    return this.currentProvider?.getViewType() ?? ViewType.Unknown;
  }

  get isAudioView(): PlayerState['isAudioView'] {
    return this.viewType === ViewType.Audio;
  }

  get isVideoView(): PlayerState['isVideoView'] {
    return this.viewType === ViewType.Video;
  }

  get mediaType(): PlayerState['mediaType'] {
    return this.currentProvider?.getMediaType() ?? MediaType.Unknown;
  }

  get isAudio(): PlayerState['isAudio'] {
    return this.mediaType === MediaType.Audio;
  }

  get isVideo(): PlayerState['isVideo'] {
    return this.mediaType === MediaType.Video;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Provider Requests
   *
   * This section contains methods responsible for requesting a state change on the current
   * provider.
   * -------------------------------------------------------------------------------------------
   */

  protected requestPlaybackChange(paused: PlayerState['paused']): void {
    // TODO: how should we handle play success/fail? Throw error??
    if (paused) {
      this.currentProvider?.pause();
    } else {
      this.currentProvider?.play();
    }
  }

  protected requestControls(isControlsVisible: PlayerState['controls']): void {
    // TODO: probably log if controls are requested but no provider.
    this.currentProvider?.setControlsVisibility(isControlsVisible);
  }

  protected requestVolumeChange(volume: PlayerState['volume']): void {
    // TODO: probably log if volume change requested but no provider.
    this.currentProvider?.setVolume(volume);
  }

  protected requestTimeChange(time: PlayerState['currentTime']): void {
    // TODO: probably log if time change requested but no provider.
    this.currentProvider?.setCurrentTime(time);
  }

  protected requestMutedChange(muted: PlayerState['muted']): void {
    // TODO: probably log if muted change requested but no provider.
    this.currentProvider?.setMuted(muted);
  }

  protected requestPosterChange(poster?: PlayerState['poster']): void {
    // TODO: probably log if poster change requested but no provider.
    this.currentProvider?.setPoster(poster);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * User Events
   *
   * This section is responsible for listening to user events and calling the appropriate
   * provider request method.
   *
   * @example `UserPlayRequest` --> `this.requestPlaybackChange(false)`.
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

  // This handler is attached to user events in the "Connect" section above.
  protected handleUserEvent(e: VdsCustomEvent<unknown, unknown>): void {
    if (!this.userEventGateway(e)) return;
    this.requestProviderUpdate(e);
  }

  protected requestProviderUpdate(e: VdsCustomEvent<unknown, unknown>): void {
    switch (e.type) {
      case UserPlayRequestEvent.TYPE:
        this.requestPlaybackChange(false);
        break;
      case UserPauseRequestEvent.TYPE:
        this.requestPlaybackChange(true);
        break;
      case UserMutedChangeRequestEvent.TYPE:
        this.requestMutedChange(e.detail as PlayerState['muted']);
        break;
      case UserVolumeChangeRequestEvent.TYPE:
        this.requestVolumeChange(e.detail as PlayerState['volume']);
        break;
      case UserTimeChangeRequestEvent.TYPE:
        this.requestTimeChange(e.detail as PlayerState['currentTime']);
        break;
    }
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

  protected providerToPlayerEventMap: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VdsCustomEventConstructor<any, unknown>
  > = {
    [ProviderPlayEvent.TYPE]: PlayEvent,
    [ProviderPauseEvent.TYPE]: PauseEvent,
    [ProviderPlayingEvent.TYPE]: PlayingEvent,
    [ProviderMutedChangeEvent.TYPE]: MutedChangeEvent,
    [ProviderVolumeChangeEvent.TYPE]: VolumeChangeEvent,
    [ProviderTimeChangeEvent.TYPE]: TimeChangeEvent,
    [ProviderDurationChangeEvent.TYPE]: DurationChangeEvent,
    [ProviderBufferedChangeEvent.TYPE]: BufferedChangeEvent,
    [ProviderBufferingChangeEvent.TYPE]: BufferingChangeEvent,
    [ProviderViewTypeChangeEvent.TYPE]: ViewTypeChangeEvent,
    [ProviderMediaTypeChangeEvent.TYPE]: MediaTypeChangeEvent,
    [ProviderReadyEvent.TYPE]: ReadyEvent,
    [ProviderPlaybackReadyEvent.TYPE]: PlaybackReadyEvent,
    [ProviderPlaybackStartEvent.TYPE]: PlaybackStartEvent,
    [ProviderPlaybackEndEvent.TYPE]: PlaybackEndEvent,
    [ProviderErrorEvent.TYPE]: ErrorEvent,
  };

  protected providerEventGateway(e: Event): boolean {
    if (!this.allowProviderEventsToBubble) e.stopPropagation();
    return true;
  }

  // This handler is attached to provider events in the "Connect" section above.
  protected handleProviderEvent(e: VdsCustomEvent<unknown, unknown>): void {
    if (!this.providerEventGateway(e)) return;

    this.updateContext(e);
    this.translateProviderEventAndDispatch(e);

    switch (e.type) {
      case ProviderConnectEvent.TYPE:
        this.handleProviderConnect(e as ProviderConnectEvent);
        break;
      case ProviderReadyEvent.TYPE:
        this.handleProviderReady();
        break;
      case ProviderDisconnectEvent.TYPE:
        this.handleProviderDisconnect(e as ProviderDisconnectEvent);
        break;
      case ProviderViewTypeChangeEvent.TYPE:
        this.handleProviderViewTypeChange();
        break;
      case ProviderErrorEvent.TYPE:
        this.handleProviderError();
        break;
    }
  }

  protected translateProviderEventAndDispatch(
    e: VdsCustomEvent<unknown, unknown>,
  ): void {
    const playerEvent = this.providerToPlayerEventMap[e.type];
    if (!isUndefined(playerEvent)) {
      this.dispatchEvent(
        new playerEvent({ originalEvent: e, detail: e.detail }),
      );
    }
  }

  protected updateContext(e: VdsCustomEvent<unknown, unknown>): void {
    switch (e.type) {
      case ProviderPlayEvent.TYPE:
        this.pausedCtx = false;
        break;
      case ProviderPauseEvent.TYPE:
        this.pausedCtx = true;
        this.isPlayingCtx = false;
        break;
      case ProviderPlayingEvent.TYPE:
        this.pausedCtx = false;
        this.isPlayingCtx = true;
        break;
      case ProviderTimeChangeEvent.TYPE:
        this.currentTimeCtx = e.detail as PlayerState['currentTime'];
        break;
      case ProviderMutedChangeEvent.TYPE:
        this.mutedCtx = e.detail as PlayerState['muted'];
        break;
      case ProviderVolumeChangeEvent.TYPE:
        this.volumeCtx = e.detail as PlayerState['volume'];
        break;
      case ProviderDurationChangeEvent.TYPE:
        this.durationCtx = e.detail as PlayerState['duration'];
        break;
      case ProviderBufferedChangeEvent.TYPE:
        this.bufferedCtx = e.detail as PlayerState['buffered'];
        break;
      case ProviderBufferingChangeEvent.TYPE:
        this.isBufferingCtx = e.detail as PlayerState['isBuffering'];
        break;
      case ProviderViewTypeChangeEvent.TYPE:
        this.viewTypeCtx = e.detail as PlayerState['viewType'];
        this.isAudioViewCtx = this.isAudioView;
        this.isVideoCtx = this.isVideoView;
        break;
      case ProviderMediaTypeChangeEvent.TYPE:
        this.mediaTypeCtx = e.detail as PlayerState['mediaType'];
        this.isAudioCtx = this.isAudio;
        this.isVideoCtx = this.isVideo;
        break;
      case ProviderReadyEvent.TYPE:
        this.isProviderReadyCtx = true;
        break;
      case ProviderPlaybackReadyEvent.TYPE:
        this.isPlaybackReadyCtx = true;
        break;
      case ProviderPlaybackStartEvent.TYPE:
        this.hasPlaybackStartedCtx = true;
        break;
      case ProviderPlaybackEndEvent.TYPE:
        this.hasPlaybackEndedCtx = true;
        break;
    }
  }

  protected handleProviderConnect(e: ProviderConnectEvent): void {
    const connectedProvider = e.detail;
    this.mediaProviders.add(connectedProvider);
    this.handleMediaProviderSetChange();
  }

  protected handleProviderDisconnect(e: ProviderDisconnectEvent): void {
    const disconnectedProvider = e.detail;

    if (this._currentProvider === disconnectedProvider) {
      this._currentProvider = undefined;
      this.currentlyLoadedSrc = undefined;
    }

    this.mediaProviders.delete(disconnectedProvider);
    this.handleMediaProviderSetChange();
  }

  protected handleProviderReady(): void {
    this.loadMedia();
  }

  protected handleProviderError(): void {
    // TODO: handle this error.
  }

  protected handleProviderViewTypeChange(): void {
    this.setAttribute(this.getAudioAttrName(), String(this.isAudioView));
    this.setAttribute(this.getVideoAttrName(), String(this.isVideoView));
  }

  protected getAudioAttrName(): string {
    return 'audio';
  }

  protected getVideoAttrName(): string {
    return 'video';
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Context Properties
   *
   * This section is responsible for defining context properties. They are mostly updated in the
   * "Provider Events" section above.
   * -------------------------------------------------------------------------------------------
   */

  @playerContext.uuid.provide()
  protected uuidCtx = playerContext.uuid.defaultValue;

  @playerContext.src.provide()
  protected srcCtx = playerContext.src.defaultValue;

  @playerContext.volume.provide()
  protected volumeCtx = playerContext.volume.defaultValue;

  @playerContext.currentTime.provide()
  protected currentTimeCtx = playerContext.currentTime.defaultValue;

  @playerContext.paused.provide()
  protected pausedCtx = playerContext.paused.defaultValue;

  @playerContext.controls.provide()
  protected controlsCtx = playerContext.controls.defaultValue;

  @playerContext.poster.provide()
  protected posterCtx = playerContext.poster.defaultValue;

  @playerContext.muted.provide()
  protected mutedCtx = playerContext.muted.defaultValue;

  @playerContext.aspectRatio.provide()
  protected aspectRatioCtx = playerContext.aspectRatio.defaultValue;

  @playerContext.duration.provide()
  protected durationCtx = playerContext.duration.defaultValue;

  @playerContext.buffered.provide()
  protected bufferedCtx = playerContext.buffered.defaultValue;

  @playerContext.device.provide()
  protected deviceCtx = playerContext.device.defaultValue;

  @playerContext.isMobileDevice.provide()
  protected isMobileDeviceCtx = playerContext.isMobileDevice.defaultValue;

  @playerContext.isDesktopDevice.provide()
  protected isDesktopDeviceCtx = playerContext.isDesktopDevice.defaultValue;

  @playerContext.isBuffering.provide()
  protected isBufferingCtx = playerContext.isBuffering.defaultValue;

  @playerContext.isPlaying.provide()
  protected isPlayingCtx = playerContext.isPlaying.defaultValue;

  @playerContext.hasPlaybackStarted.provide()
  protected hasPlaybackStartedCtx =
    playerContext.hasPlaybackStarted.defaultValue;

  @playerContext.hasPlaybackEnded.provide()
  protected hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

  @playerContext.isProviderReady.provide()
  protected isProviderReadyCtx = playerContext.isProviderReady.defaultValue;

  @playerContext.isPlaybackReady.provide()
  protected isPlaybackReadyCtx = playerContext.isPlaybackReady.defaultValue;

  @playerContext.viewType.provide()
  protected viewTypeCtx = playerContext.viewType.defaultValue;

  @playerContext.isAudioView.provide()
  protected isAudioViewCtx = playerContext.isAudioView.defaultValue;

  @playerContext.isVideoView.provide()
  protected isVideoViewCtx = playerContext.isVideoView.defaultValue;

  @playerContext.mediaType.provide()
  protected mediaTypeCtx = playerContext.mediaType.defaultValue;

  @playerContext.isAudio.provide()
  protected isAudioCtx = playerContext.isAudio.defaultValue;

  @playerContext.isVideo.provide()
  protected isVideoCtx = playerContext.isVideo.defaultValue;
}
