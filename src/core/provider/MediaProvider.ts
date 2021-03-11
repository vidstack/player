import { listen } from '@wcom/events';
import { LitElement, property } from 'lit-element';
import { StyleInfo } from 'lit-html/directives/style-map';

import { deferredPromise } from '../../utils/promise';
import { isString } from '../../utils/unit';
import { CanPlayType } from '../CanPlayType';
import { DeviceObserverMixin } from '../device/DeviceObserverMixin';
import { MediaType } from '../MediaType';
import { playerContext } from '../player.context';
import {
  ConnectEvent,
  DisconnectEvent,
  ErrorEvent,
  MediaTypeChangeEvent,
  PlaybackReadyEvent,
  ViewTypeChangeEvent,
} from '../player.events';
import {
  PlayerContext,
  PlayerContextProvider,
  PlayerMethods,
  PlayerProps,
} from '../player.types';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
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
export abstract class MediaProvider<EngineType = unknown>
  extends DeviceObserverMixin(UuidMixin(LitElement))
  implements PlayerProps, PlayerMethods, ProviderProps {
  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchEvent(new ConnectEvent({ detail: this }));
  }

  disconnectedCallback(): void {
    this.resetRequestQueue();
    this.hardResetContext();
    this.dispatchEvent(new ViewTypeChangeEvent({ detail: ViewType.Unknown }));
    this.dispatchEvent(new DisconnectEvent({ detail: this }));
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Writable Properties
  // -------------------------------------------------------------------------------------------

  @property({ type: Number })
  get volume(): number {
    return this.isPlaybackReady ? this.getVolume() : 1;
  }

  set volume(newVolume: number) {
    this.makeRequest('volume', () => {
      this.setVolume(newVolume);
    });
  }

  protected abstract getVolume(): number;
  protected abstract setVolume(newVolume: number): void;

  // ---

  @property({ type: Boolean })
  get paused(): boolean {
    return this.isPlaybackReady ? this.getPaused() : true;
  }

  set paused(isPaused: boolean) {
    this.makeRequest('paused', () => {
      if (!isPaused) {
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
    return this.isPlaybackReady ? this.getCurrentTime() : 0;
  }

  set currentTime(newTime: number) {
    this.makeRequest('time', () => {
      this.setCurrentTime(newTime);
    });
  }

  protected abstract getCurrentTime(): number;
  protected abstract setCurrentTime(newTime: number): void;

  // ---

  @property({ type: Boolean })
  get muted(): boolean {
    return this.isPlaybackReady ? this.getMuted() : false;
  }

  set muted(isMuted: boolean) {
    this.makeRequest('muted', () => {
      this.setMuted(isMuted);
    });
  }

  protected abstract getMuted(): boolean;
  protected abstract setMuted(isMuted: boolean): void;

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

  @property() aspectRatio: string | undefined = undefined;

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

  get isPlaybackReady(): boolean {
    return this.isPlaybackReadyCtx;
  }

  get currentSrc(): string {
    return this.currentSrcCtx;
  }

  get currentPoster(): string {
    return this.currentPosterCtx;
  }

  get duration(): number {
    return this.durationCtx;
  }

  get buffered(): number {
    return this.bufferedCtx;
  }

  get isBuffering(): boolean {
    return this.isBufferingCtx;
  }

  get isPlaying(): boolean {
    return this.isPlayingCtx;
  }

  get hasPlaybackStarted(): boolean {
    return this.hasPlaybackStartedCtx;
  }

  get hasPlaybackEnded(): boolean {
    return this.hasPlaybackEndedCtx;
  }

  get mediaType(): MediaType {
    return this.mediaTypeCtx;
  }

  get isAudio(): boolean {
    return this.mediaType === MediaType.Audio;
  }

  get isVideo(): boolean {
    return this.mediaType === MediaType.Video;
  }

  get viewType(): ViewType {
    return this.viewTypeCtx;
  }

  get isAudioView(): boolean {
    return this.viewType === ViewType.Audio;
  }

  get isVideoView(): boolean {
    return this.viewType === ViewType.Video;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  abstract canPlayType(type: string): CanPlayType;

  shouldPlayType(type: string): boolean {
    const canPlayType = this.canPlayType(type);
    return (
      canPlayType === CanPlayType.Maybe || canPlayType === CanPlayType.Probably
    );
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  protected throwIfNotReady(): void {
    if (!this.isPlaybackReady) {
      throw Error(
        `Media is not ready - wait for \`${PlaybackReadyEvent.TYPE}\` event.`,
      );
    }
  }

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;

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

  // -------------------------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------------------------

  protected getAriaBusy(): 'true' | 'false' {
    return this.isPlaybackReady ? 'false' : 'true';
  }

  protected getContextStyleMap(): StyleInfo {
    return {
      '--vds-volume': String(this.volume),
      '--vds-current-time': String(this.currentTime),
      '--vds-duration': String(this.duration > 0 ? this.duration : 0),
      '--vds-buffered': String(this.buffered),
    };
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

  @listen(UserPlayRequestEvent.TYPE)
  protected handleUserPlayRequest(e: UserPlayRequestEvent): void {
    this.userEventGateway(e);
    this.paused = false;
  }

  @listen(UserPauseRequestEvent.TYPE)
  protected handleUserPauseRequest(e: UserPauseRequestEvent): void {
    this.userEventGateway(e);
    this.paused = true;
  }

  @listen(UserMutedChangeRequestEvent.TYPE)
  protected handleUserMutedChangeRequest(e: UserMutedChangeRequestEvent): void {
    this.userEventGateway(e);
    this.muted = e.detail;
  }

  @listen(UserTimeChangeRequestEvent.TYPE)
  protected handleUserTimeChangeRequest(e: UserTimeChangeRequestEvent): void {
    this.userEventGateway(e);
    this.currentTime = e.detail;
  }

  @listen(UserVolumeChangeRequestEvent.TYPE)
  protected handleUserVolumeChangeRequest(
    e: UserVolumeChangeRequestEvent,
  ): void {
    this.userEventGateway(e);
    this.volume = e.detail;
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Requests are queued if called before media is ready for playback. Once the media is
   * ready (`ProviderPlaybackReadyEvent`) the queue is flushed. Each request is associated with
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
    await this.pendingRequestQueueFlush.promise;
  }

  protected async safelyMakeRequest(
    requestKey: ProviderRequestKey,
  ): Promise<void> {
    try {
      await this.requestQueue.get(requestKey)?.();
    } catch (e) {
      this.dispatchEvent(new ErrorEvent({ detail: e }));
    }

    this.requestQueue.delete(requestKey);
    this.requestUpdate();
  }

  /**
   * This method will attempt to make a request if the current provider is ready
   * for playback, otherwise it'll queue the request to be fulfilled when the
   * `ProviderPlaybackReadyEvent` is fired.
   *
   * @param requestKey - A unique key to identify the request.
   * @param action - The action to be performed when the request is fulfilled.
   */
  protected makeRequest(
    requestKey: ProviderRequestKey,
    request: ProviderRequestAction,
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
  }

  @listen(PlaybackReadyEvent.TYPE)
  protected async handleFlushRequestQueue(): Promise<void> {
    await this.flushRequestQueue();
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

  get context(): PlayerContextProvider {
    return this as PlayerContextProvider;
  }

  /**
   * Context properties that should be reset when media is changed.
   */
  protected softResettableCtxProps = new Set<keyof PlayerContext>([
    'paused',
    'currentTime',
    'duration',
    'buffered',
    'isPlaying',
    'isBuffering',
    'isPlaybackReady',
    'hasPlaybackStarted',
    'hasPlaybackEnded',
    'mediaType',
  ]);

  /**
   * When the `currentSrc` is changed this method is called to update any context properties
   * that need to be reset. Important to note that not all properties are reset, only the
   * properties in the `softResettableCtxProps` set.
   */
  protected softResetContext(): void {
    const props = (Object.keys(
      playerContext,
    ) as unknown) as (keyof PlayerContext)[];

    const ctx = this.context;

    props.forEach(prop => {
      if (this.softResettableCtxProps.has(prop)) {
        ctx[`${prop}Ctx`] = playerContext[prop].defaultValue;
      }
    });
  }

  /**
   * Called when the provider disconnects, resets the player context completely.
   */
  protected hardResetContext(): void {
    const props = (Object.keys(
      playerContext,
    ) as unknown) as (keyof PlayerContext)[];

    const ctx = this.context;

    props.forEach(prop => {
      ctx[`${prop}Ctx`] = playerContext[prop].defaultValue;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Context Properties
  // -------------------------------------------------------------------------------------------

  @playerContext.currentSrc.provide()
  protected currentSrcCtx = playerContext.currentSrc.defaultValue;

  @playerContext.volume.provide()
  protected volumeCtx = playerContext.volume.defaultValue;

  @playerContext.currentTime.provide()
  protected currentTimeCtx = playerContext.currentTime.defaultValue;

  @playerContext.paused.provide()
  protected pausedCtx = playerContext.paused.defaultValue;

  @playerContext.controls.provide()
  protected controlsCtx = playerContext.controls.defaultValue;

  @playerContext.currentPoster.provide()
  protected currentPosterCtx = playerContext.currentPoster.defaultValue;

  @playerContext.muted.provide()
  protected mutedCtx = playerContext.muted.defaultValue;

  @playerContext.playsinline.provide()
  protected playsinlineCtx = playerContext.playsinline.defaultValue;

  @playerContext.loop.provide()
  protected loopCtx = playerContext.loop.defaultValue;

  @playerContext.aspectRatio.provide()
  protected aspectRatioCtx = playerContext.aspectRatio.defaultValue;

  @playerContext.duration.provide()
  protected durationCtx = playerContext.duration.defaultValue;

  @playerContext.buffered.provide()
  protected bufferedCtx = playerContext.buffered.defaultValue;

  @playerContext.isBuffering.provide()
  protected isBufferingCtx = playerContext.isBuffering.defaultValue;

  @playerContext.isPlaying.provide()
  protected isPlayingCtx = playerContext.isPlaying.defaultValue;

  @playerContext.hasPlaybackStarted.provide()
  protected hasPlaybackStartedCtx =
    playerContext.hasPlaybackStarted.defaultValue;

  @playerContext.hasPlaybackEnded.provide()
  protected hasPlaybackEndedCtx = playerContext.hasPlaybackEnded.defaultValue;

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

  // -------------------------------------------------------------------------------------------
  // Context Updates
  // -------------------------------------------------------------------------------------------

  // TODO: Create derived context provider in `@wcom/context`.

  @listen(ViewTypeChangeEvent.TYPE)
  protected handleViewTypeContextUpdate(e: ViewTypeChangeEvent): void {
    const viewType = e.detail;
    this.viewTypeCtx = viewType;
    this.isAudioViewCtx = viewType === ViewType.Audio;
    this.isVideoViewCtx = viewType === ViewType.Video;
    this.setAttribute('audio', String(this.isAudioViewCtx));
    this.setAttribute('video', String(this.isVideoViewCtx));
  }

  @listen(MediaTypeChangeEvent.TYPE)
  protected handleMediaTypeContextUpdate(e: MediaTypeChangeEvent): void {
    const mediaType = e.detail;
    this.mediaTypeCtx = mediaType;
    this.isAudioCtx = mediaType === MediaType.Audio;
    this.isVideoCtx = mediaType === MediaType.Video;
  }
}
