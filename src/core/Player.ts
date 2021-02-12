import { Disposal, listen, listenTo } from '@wcom/events';
import { v4 as uuid } from '@lukeed/uuid';
import {
  html,
  LitElement,
  property,
  CSSResultArray,
  TemplateResult,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import clsx from 'clsx';
import { MediaType, PlayerProps, PlayerState, ViewType } from './player.types';
import {
  Device,
  InputDevice,
  IS_CLIENT,
  noop,
  onDeviceChange,
  onInputDeviceChange,
} from '../utils';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import {
  ALL_PROVIDER_EVENTS,
  ALL_USER_EVENTS,
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
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
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
  ReadyEvent,
  TimeChangeEvent,
  InputDeviceChangeEvent,
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
  ErrorEvent,
} from './events';
import { VdsCustomEvent, VdsCustomEventConstructor } from '../shared/events';
import { isTestEnv } from './env';

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
 * @fires vds-input-device-change - Emitted when the input device changes between touch/mouse/keyboard.
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
export class Player extends LitElement implements PlayerProps {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }

  private disposal = new Disposal();

  connectedCallback(): void {
    super.connectedCallback();
    this.connect();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposal.empty();
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
    // TODO: should have check for custom controls otherwise it'll block chromeless native player.
    const isProviderUIBlockerVisible = this.isVideoView && !this.controls;

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
        ${isProviderUIBlockerVisible
          ? html`<div class="provider-ui-blocker"></div>`
          : undefined}

        <slot></slot>
      </div>
    `;
  }

  private calcAspectRatio() {
    // TODO: throw error or log if invalid aspect ratio.
    const [width, height] = /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
      ? this.aspectRatio.split(':')
      : [16, 9];

    return (100 / Number(width)) * Number(height);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Connect
   *
   * This section contains methods that are called when the player connects to the DOM. In other
   * words initialization methods.
   * -------------------------------------------------------------------------------------------
   */

  private connect() {
    this.setUuid();
    this.listenToDeviceChanges();
    this.listenToInputDeviceChanges();
    this.listenToUserEvents();
    this.listenToProviderEvents();
  }

  private setUuid() {
    this.uuidCtx = this.uuid;
    this.setAttribute('uuid', this.uuid);
  }

  private listenToInputDeviceChanges() {
    // Allow emulated touch events to trigger mouse events in test environment so we don't
    // have to mock `Date.getTime()`.
    const off = onInputDeviceChange(
      this.handleInputDeviceChange.bind(this),
      IS_CLIENT,
      !isTestEnv(),
    );

    this.disposal.add(off);
  }

  private listenToDeviceChanges() {
    const off = onDeviceChange(this.handleDeviceChange.bind(this));
    this.disposal.add(off);
  }

  private listenToUserEvents() {
    ALL_USER_EVENTS.forEach(event => {
      const off = listenTo(this, event.TYPE, this.handleUserEvent.bind(this));
      this.disposal.add(off);
    });
  }

  private listenToProviderEvents() {
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
   * Miscellaneous Handlers
   *
   * This section contains misc. handler methods that don't belong anywhere else.
   * -------------------------------------------------------------------------------------------
   */

  private handleDeviceChange(device: Device) {
    this._device = device;
    this.isMobileDeviceCtx = this.isMobileDevice;
    this.isDesktopDeviceCtx = this.isDesktopDevice;
    this.setAttribute('mobile', String(this.isMobileDevice));
    this.setAttribute('desktop', String(this.isDesktopDevice));
    this.dispatchEvent(new DeviceChangeEvent({ detail: device }));
  }

  private handleInputDeviceChange(inputDevice: InputDevice) {
    this._inputDevice = inputDevice;
    this.isMouseInputDeviceCtx = this.isMouseInputDevice;
    this.isTouchInputDeviceCtx = this.isTouchInputDevice;
    this.isKeyboardInputDeviceCtx = this.isKeyboardInputDevice;
    this.setAttribute('touch', String(this.isTouchInputDevice));
    this.setAttribute('mouse', String(this.isMouseInputDevice));
    this.setAttribute('keyboard', String(this.isKeyboardInputDevice));
    this.dispatchEvent(new InputDeviceChangeEvent({ detail: inputDevice }));
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

  private _src: PlayerState['src'] = '';

  @property({ type: String })
  get src(): PlayerState['src'] {
    return this._src;
  }

  set src(newSrc: PlayerState['src']) {
    this._src = newSrc;
    this.srcCtx = newSrc;
    // TODO: call appropriate method.
  }

  // ---

  @property({ type: Number })
  get volume(): PlayerState['volume'] {
    // TODO: return property from provider.
    return 0.3;
  }

  set volume(newVolume: PlayerState['volume']) {
    this.requestVolumeChange(newVolume);
  }

  // ---

  @property({ type: Number })
  get currentTime(): PlayerState['currentTime'] {
    // TODO: return property from provider.
    return 0;
  }

  set currentTime(newCurrentTime: PlayerState['currentTime']) {
    this.requestTimeChange(newCurrentTime);
  }

  // ---

  @property({ type: Boolean, reflect: true })
  get paused(): PlayerState['paused'] {
    // TODO: return property from provider.
    return true;
  }

  set paused(newPaused: PlayerState['paused']) {
    this.requestPlaybackChange(newPaused);
  }

  // ---

  @property({ type: Boolean })
  get controls(): PlayerState['controls'] {
    // TODO: return property from provider.
    return false;
  }

  set controls(isControlsVisible: PlayerState['controls']) {
    this.requestControls(isControlsVisible);
  }

  // ---

  @property({ type: String })
  get poster(): PlayerState['poster'] {
    // TODO: return property from provider.
    return undefined;
  }

  set poster(newPoster: PlayerState['poster']) {
    this.requestPosterChange(newPoster);
  }

  // ---

  private _aspectRatio: PlayerState['aspectRatio'] = '16:9';

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
    // TODO: return property from provider.
    return false;
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

  private _uuid = uuid();

  get uuid(): PlayerState['uuid'] {
    return this._uuid;
  }

  get duration(): PlayerState['duration'] {
    // TODO: return property from provider.
    return -1;
  }

  get buffered(): PlayerState['buffered'] {
    // TODO: return property from provider.
    return 0;
  }

  get isBuffering(): PlayerState['isBuffering'] {
    // TODO: return property from provider.
    return false;
  }

  get isPlaying(): PlayerState['isPlaying'] {
    // TODO: return property from provider.
    return false;
  }

  private _device = playerContext.device.defaultValue;

  get device(): PlayerState['device'] {
    return this._device;
  }

  get isMobileDevice(): PlayerState['isMobileDevice'] {
    return this._device === Device.Mobile;
  }

  get isDesktopDevice(): PlayerState['isDesktopDevice'] {
    return this._device === Device.Desktop;
  }

  private _inputDevice = playerContext.inputDevice.defaultValue;

  get inputDevice(): PlayerState['inputDevice'] {
    return this._inputDevice;
  }

  get isTouchInputDevice(): PlayerState['isTouchInputDevice'] {
    return this._inputDevice === InputDevice.Touch;
  }

  get isMouseInputDevice(): PlayerState['isMouseInputDevice'] {
    return this._inputDevice === InputDevice.Mouse;
  }

  get isKeyboardInputDevice(): PlayerState['isKeyboardInputDevice'] {
    return this._inputDevice === InputDevice.Keyboard;
  }

  get hasPlaybackStarted(): PlayerState['hasPlaybackStarted'] {
    // TODO: return property from provider.
    return false;
  }

  get hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
    // TODO: return property from provider.
    return false;
  }

  get isProviderReady(): PlayerState['isProviderReady'] {
    // TODO: return property from provider.
    return false;
  }

  get isPlaybackReady(): PlayerState['isPlaybackReady'] {
    // TODO: return property from provider.
    return false;
  }

  get viewType(): PlayerState['viewType'] {
    // TODO: return property from provider.
    return ViewType.Unknown;
  }

  get isAudioView(): PlayerState['isAudioView'] {
    return this.viewType === ViewType.Audio;
  }

  get isVideoView(): PlayerState['isVideoView'] {
    return this.viewType === ViewType.Video;
  }

  get mediaType(): PlayerState['mediaType'] {
    // TODO: return property from provider.
    return MediaType.Unknown;
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

  private requestPlaybackChange(paused: PlayerState['paused']) {
    // TODO: call method on provider - handle play success/fail.
    noop(paused);
  }

  private requestControls(isControlsVisible: PlayerState['controls']) {
    // TODO: call method on provider.
    noop(isControlsVisible);
  }

  private requestVolumeChange(volume: PlayerState['volume']) {
    // TODO: call method on provider.
    noop(volume);
  }

  private requestTimeChange(time: PlayerState['currentTime']) {
    // TODO: call method on provider.
    noop(time);
  }

  private requestMutedChange(muted: PlayerState['muted']) {
    // TODO: call method on provider.
    noop(muted);
  }

  private requestPosterChange(poster?: PlayerState['poster']) {
    // TODO: call method on provider.
    noop(poster);
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

  private userEventGateway(e: Event) {
    if (!this.allowUserEventsToBubble) e.stopPropagation();
    return true;
  }

  // This handler is attached to user events in the "Connect" section above.
  private handleUserEvent(e: VdsCustomEvent<unknown, unknown>) {
    if (!this.userEventGateway(e)) return;
    this.requestProviderUpdate(e);
  }

  private requestProviderUpdate(e: VdsCustomEvent<unknown, unknown>) {
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

  private providerToPlayerEventMap: Record<
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

  private providerEventGateway(e: Event) {
    if (!this.allowProviderEventsToBubble) e.stopPropagation();
    return true;
  }

  // This handler is attached to provider events in the "Connect" section above.
  private handleProviderEvent(e: VdsCustomEvent<unknown, unknown>) {
    if (!this.providerEventGateway(e)) return;
    this.updateContext(e);
    this.translateProviderEventAndDispatch(e);
  }

  private translateProviderEventAndDispatch(
    e: VdsCustomEvent<unknown, unknown>,
  ) {
    const playerEvent = this.providerToPlayerEventMap[e.type];
    this.dispatchEvent(new playerEvent({ originalEvent: e, detail: e.detail }));
  }

  private updateContext(e: VdsCustomEvent<unknown, unknown>) {
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
      case ProviderMutedChangeEvent.TYPE:
        this.mutedCtx = e.detail as PlayerState['muted'];
        break;
      case ProviderVolumeChangeEvent.TYPE:
        this.volumeCtx = e.detail as PlayerState['volume'];
        break;
      case ProviderTimeChangeEvent.TYPE:
        this.currentTimeCtx = e.detail as PlayerState['currentTime'];
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

  @listen(ProviderViewTypeChangeEvent.TYPE)
  private handleProviderViewTypeChange() {
    this.setAttribute('audio', String(this.isAudioView));
    this.setAttribute('video', String(this.isVideoView));
  }

  @listen(ProviderErrorEvent.TYPE)
  private handleProviderError() {
    // TODO: handle this error.
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
  private uuidCtx = playerContext.uuid.defaultValue;

  @playerContext.src.provide()
  private srcCtx = playerContext.src.defaultValue;

  @playerContext.volume.provide()
  private volumeCtx = playerContext.volume.defaultValue;

  @playerContext.currentTime.provide()
  private currentTimeCtx = playerContext.currentTime.defaultValue;

  @playerContext.paused.provide()
  private pausedCtx = playerContext.paused.defaultValue;

  @playerContext.controls.provide()
  private controlsCtx = playerContext.controls.defaultValue;

  @playerContext.poster.provide()
  private posterCtx = playerContext.poster.defaultValue;

  @playerContext.muted.provide()
  private mutedCtx = playerContext.muted.defaultValue;

  @playerContext.aspectRatio.provide()
  private aspectRatioCtx = playerContext.aspectRatio.defaultValue;

  @playerContext.duration.provide()
  private durationCtx = playerContext.duration.defaultValue;

  @playerContext.buffered.provide()
  private bufferedCtx = playerContext.buffered.defaultValue;

  @playerContext.device.provide()
  private deviceCtx = playerContext.device.defaultValue;

  @playerContext.isMobileDevice.provide()
  private isMobileDeviceCtx = playerContext.isMobileDevice.defaultValue;

  @playerContext.isDesktopDevice.provide()
  private isDesktopDeviceCtx = playerContext.isDesktopDevice.defaultValue;

  @playerContext.inputDevice.provide()
  private inputDeviceCtx = playerContext.inputDevice.defaultValue;

  @playerContext.isTouchInputDevice.provide()
  private isTouchInputDeviceCtx = playerContext.isTouchInputDevice.defaultValue;

  @playerContext.isMouseInputDevice.provide()
  private isMouseInputDeviceCtx = playerContext.isMouseInputDevice.defaultValue;

  @playerContext.isKeyboardInputDevice.provide()
  private isKeyboardInputDeviceCtx =
    playerContext.isKeyboardInputDevice.defaultValue;

  @playerContext.isBuffering.provide()
  private isBufferingCtx = playerContext.isBuffering.defaultValue;

  @playerContext.isPlaying.provide()
  private isPlayingCtx = playerContext.isPlaying.defaultValue;

  @playerContext.hasPlaybackStarted.provide()
  private hasPlaybackStartedCtx = playerContext.hasPlaybackStarted.defaultValue;

  @playerContext.hasPlaybackEnded.provide()
  private hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

  @playerContext.isProviderReady.provide()
  private isProviderReadyCtx = playerContext.isProviderReady.defaultValue;

  @playerContext.isPlaybackReady.provide()
  private isPlaybackReadyCtx = playerContext.isPlaybackReady.defaultValue;

  @playerContext.viewType.provide()
  private viewTypeCtx = playerContext.viewType.defaultValue;

  @playerContext.isAudioView.provide()
  private isAudioViewCtx = playerContext.isAudioView.defaultValue;

  @playerContext.isVideoView.provide()
  private isVideoViewCtx = playerContext.isVideoView.defaultValue;

  @playerContext.mediaType.provide()
  private mediaTypeCtx = playerContext.mediaType.defaultValue;

  @playerContext.isAudio.provide()
  private isAudioCtx = playerContext.isAudio.defaultValue;

  @playerContext.isVideo.provide()
  private isVideoCtx = playerContext.isVideo.defaultValue;
}
