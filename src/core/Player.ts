import { Disposal, listen } from '@wcom/events';
import { CSSResultArray, html, LitElement, property } from 'lit-element';
import { MediaType, PlayerProps, PlayerState, ViewType } from './types';
import { onInputDeviceChange } from '../utils';
import { playerContext } from './context';
import { playerStyles } from './player.css';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from './events';

/**
 * TODO: Document props/methods/events/css parts/slot, desc component
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

  // TODO: write basic render function
  render() {
    return html``;
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
    this.listenToMobileDeviceChanges();
    this.listenToMobileDeviceChanges();
  }

  private listenToTouchInputChanges() {
    const off = onInputDeviceChange(isTouchInput => {
      this._isTouchInput = isTouchInput;
    });
    this.disposal.add(off);
  }

  private listenToMobileDeviceChanges() {
    // TODO: Connect isMobileDevice - also expose for testing
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
    // TODO: call method on provider.
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

  /**
   * -------------------------------------------------------------------------------------------
   * Context Properties
   *
   * This section is responsible for defining context properties. They are mostly udpated in the
   * "Provider Events" section above.
   * -------------------------------------------------------------------------------------------
   */

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
