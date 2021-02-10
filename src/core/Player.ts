import { Disposal, listen } from '@wcom/events';
import { v4 as uuid } from '@lukeed/uuid';
import { CSSResultArray, html, LitElement, property } from 'lit-element';
import clsx from 'clsx';
import { MediaType, PlayerProps, PlayerState, ViewType } from './player.types';
import { onDeviceChange, onInputDeviceChange } from '../utils';
import { playerContext } from './player.context';
import { playerStyles } from './player.css';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './events';

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
 * @event vds-play - Emitted when playback attempts to start.
 * @event vds-pause - Emitted when playback pauses.
 * @event vds-playing - Emitted when playback being playback.
 * @event vds-muted-change - Emitted when the muted state of the current provider changes.
 * @event vds-volume-change - Emitted when the volume state of the current provider changes.
 * @event vds-time-change - Emitted when the current playback time changes.
 * @event vds-duration-change - Emitted when the length of the media changes.
 * @event vds-buffered-change - Emitted when the length of the media downloaded changes.
 * @event vds-view-type-change - Emitted when the view type of the current provider/media changes.
 * @event vds-media-type-change - Emitted when the media type of the current provider/media changes.
 * @event vds-playback-ready - Emitted when playback is ready to start - analgous with `canPlayThrough`.
 * @event vds-playback-start - Emitted when playback has started (`currentTime > 0`).
 * @event vds-playback-end - Emitted when playback ends (`currentTime === duration`).
 * @event vds-mobile-device-change - Emitted when the type of user device changes between mobile/desktop.
 * @event vds-touch-input-change - Emitted when the input device changes between touch/mouse.
 * @event vds-error - Emitted when a provider encounters an error during media loading/playback.
 *
 * @slot - Used to pass in Provider/UI components.
 */
export class Player extends LitElement implements PlayerProps {
  public static get styles(): CSSResultArray {
    return [playerStyles];
  }

  private disposal = new Disposal();

  connectedCallback() {
    this.connect();
  }

  disconnectedCallback() {
    this.disposal.empty();
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Render
   *
   * This section contains methods involved in the rendering of the player.
   * -------------------------------------------------------------------------------------------
   */

  render() {
    const isAriaHidden = this.isProviderReady ? 'false' : 'true';
    const isAriaBusy = this.isPlaybackReady ? 'false' : 'true';
    const isProviderUIBlockerVisible = this.isVideoView;

    const classes = {
      player: true,
      audio: this.isAudioView,
      video: this.isVideoView,
    };

    const styles = {
      paddingBottom: this.isVideoView
        ? `${this.calcAspectRatio()}%`
        : undefined,
    };

    return html`
      <div
        aria-hidden="${isAriaHidden}"
        aria-busy="${isAriaBusy}"
        class="${clsx(classes)}"
        styles="${clsx(styles)}"
      >
        ${isProviderUIBlockerVisible &&
        html`<div class="provider-ui-blocker"></div>`}
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
    this.listenToTouchInputChanges();
    this.listenToMobileDeviceChanges();
  }

  private setUuid() {
    this.uuidCtx = this.uuid;
    this.setAttribute('uuid', this.uuid);
  }

  private listenToTouchInputChanges() {
    const off = onInputDeviceChange(isTouchInput => {
      this._isTouchInput = isTouchInput;
      this.setAttribute('touch', String(isTouchInput));
    });

    this.disposal.add(off);
  }

  private listenToMobileDeviceChanges() {
    const off = onDeviceChange(isMobileDevice => {
      this._isMobileDevice = isMobileDevice;
      this.setAttribute('mobile', String(isMobileDevice));
    });

    this.disposal.add(off);
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
  get src() {
    return this._src;
  }

  set src(newSrc) {
    this._src = newSrc;
    // TODO: call appropriate method.
  }

  // ---

  @property({ type: Number })
  get volume() {
    // TODO: return property from provider.
    return 30;
  }

  set volume(newVolume) {
    this.requestVolumeChange(newVolume);
  }

  // ---

  @property({ type: Number })
  get currentTime() {
    // TODO: return property from provider.
    return 0;
  }

  set currentTime(newCurrentTime) {
    this.requestTimeChange(newCurrentTime);
  }

  // ---

  @property({ type: Boolean, reflect: true })
  get paused() {
    // TODO: return property from provider.
    return true;
  }

  set paused(newPaused) {
    this.requestPlaybackChange(newPaused);
  }

  // ---

  @property({ type: String })
  get poster() {
    // TODO: return property from provider.
    return undefined;
  }

  set poster(newPoster) {
    this.requestPosterChange(newPoster);
  }

  // ---

  @property({ type: String, attribute: 'aspect-ratio', reflect: true })
  aspectRatio = playerContext.aspectRatio.defaultValue;

  // ---

  @property({ type: Boolean })
  get muted() {
    // TODO: return property from provider.
    return false;
  }

  set muted(newMuted) {
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

  get uuid() {
    return this._uuid;
  }

  get duration() {
    // TODO: return property from provider.
    return -1;
  }

  get buffered() {
    // TODO: return property from provider.
    return 0;
  }

  get isBuffering() {
    // TODO: return property from provider.
    return false;
  }

  get isPlaying() {
    // TODO: return property from provider.
    return false;
  }

  private _isMobileDevice: PlayerState['isMobileDevice'] = false;

  get isMobileDevice() {
    return this._isMobileDevice;
  }

  private _isTouchInput: PlayerState['isTouchInput'] = false;

  get isTouchInput() {
    return this._isTouchInput;
  }

  get hasPlaybackStarted() {
    // TODO: return property from provider.
    return false;
  }

  get hasPlaybackEnded() {
    // TODO: return property from provider.
    return false;
  }

  get isProviderReady() {
    // TODO: return property from provider.
    return false;
  }

  get isPlaybackReady() {
    // TODO: return property from provider.
    return false;
  }

  get viewType() {
    // TODO: return property from provider.
    return ViewType.Unknown;
  }

  get isAudioView() {
    return this.viewType === ViewType.Audio;
  }

  get isVideoView() {
    return this.viewType === ViewType.Video;
  }

  get mediaType() {
    // TODO: return property from provider.
    return MediaType.Unknown;
  }

  get isAudio() {
    return this.mediaType === MediaType.Audio;
  }

  get isVideo() {
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

  private requestPlaybackChange(paused: boolean) {
    // TODO: call method on provider - handle play success/fail.
    console.log(paused);
  }

  private requestVolumeChange(volume: number) {
    // TODO: call method on provider.
    console.log(volume);
  }

  private requestTimeChange(time: number) {
    // TODO: call method on provider.
    console.log(time);
  }

  private requestMutedChange(muted: boolean) {
    // TODO: call method on provider.
    console.log(muted);
  }

  private requestPosterChange(poster?: string) {
    // TODO: call method on provider.
    console.log(poster);
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
  }

  @listen(UserPlayRequestEvent.TYPE)
  private handleUserPlayRequest(e: Event) {
    this.userEventGateway(e);
    this.requestPlaybackChange(false);
  }

  @listen(UserPauseRequestEvent.TYPE)
  private handleUserPauseRequest(e: Event) {
    this.userEventGateway(e);
    this.requestPlaybackChange(true);
  }

  @listen(UserMutedChangeRequestEvent.TYPE)
  private handleUserMuteRequest(e: UserMutedChangeRequestEvent) {
    this.userEventGateway(e);
    this.requestMutedChange(e.detail);
  }

  @listen(UserVolumeChangeRequestEvent.TYPE)
  private handleUserVolumeChangeRequest(e: UserVolumeChangeRequestEvent) {
    this.userEventGateway(e);
    this.requestVolumeChange(e.detail);
  }

  @listen(UserTimeChangeRequestEvent.TYPE)
  private handlerUserTimeChangeRequest(e: UserTimeChangeRequestEvent) {
    this.userEventGateway(e);
    this.requestTimeChange(e.detail);
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Provider Events
   *
   * This section is responsible for translating provider events in to player events, and
   * updating context properties.
   *
   * @example `ProviderPlayEvent` --> `PlayEvent` --> DOM
   * -------------------------------------------------------------------------------------------
   */

  /**
   * Allows provider events to bubble up through the player.
   */
  @property({ type: Boolean, attribute: 'allow-provider-events-to-bubble' })
  allowProviderEventsToBubble = false;

  private providerEventGateway(e: Event) {
    if (!this.allowUserEventsToBubble) e.stopPropagation();
  }

  // TODO: connect provider events
  // TODO: update context.
  // TODO: listen to some updated lifecycle to update rest context? -> src/aspectRatio?
  // TODO: update audio/video attributes

  /**
   * -------------------------------------------------------------------------------------------
   * Context Properties
   *
   * This section is responsible for defining context properties. They are mostly udpated in the
   * "Provider Events" section above.
   * -------------------------------------------------------------------------------------------
   */

  @playerContext.src.provide()
  private uuidCtx = playerContext.uuid.defaultValue;

  @playerContext.src.provide()
  private srcCtx = playerContext.src.defaultValue;

  @playerContext.volume.provide()
  private volumeCtx = playerContext.volume.defaultValue;

  @playerContext.currentTime.provide()
  private currentTimeCtx = playerContext.currentTime.defaultValue;

  @playerContext.paused.provide()
  private pausedCtx = playerContext.paused.defaultValue;

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

  @playerContext.isMobileDevice.provide()
  private isMobileDeviceCtx = playerContext.isMobileDevice.defaultValue;

  @playerContext.isTouchInput.provide()
  private isTouchInputCtx = playerContext.isTouchInput.defaultValue;

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
