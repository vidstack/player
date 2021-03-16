import {
  contextRecordProvider,
  DerivedContext,
  provideContextRecord,
} from '@wcom/context';
import { listen } from '@wcom/events';
import { LitElement, property, PropertyValues } from 'lit-element';

import { deferredPromise } from '../../utils/promise';
import { isString, isUndefined } from '../../utils/unit';
import { CanPlayType } from '../CanPlayType';
import { DeviceObserverMixin } from '../device/DeviceObserverMixin';
import { MediaType } from '../MediaType';
import {
  PlayerContext,
  playerContext,
  PlayerContextProvider,
  transformContextName,
} from '../player.context';
import {
  ConnectEvent,
  DisconnectEvent,
  ErrorEvent,
  PlaybackReadyEvent,
  ViewTypeChangeEvent,
} from '../player.events';
import { PlayerMethods, PlayerProps } from '../player.types';
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
@provideContextRecord(playerContext, transformContextName)
export abstract class MediaProvider<EngineType = unknown>
  extends DeviceObserverMixin(UuidMixin(LitElement))
  implements PlayerProps, PlayerMethods, ProviderProps {
  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchEvent(new ConnectEvent({ detail: this }));
  }

  updated(changedProperties: PropertyValues): void {
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
    this.resetRequestQueue();
    this.hardResetContext();
    this.context.viewType = ViewType.Unknown;
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
    return this.isPlaybackReady ? this.getPaused() : true;
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
    return this.isPlaybackReady ? this.getCurrentTime() : 0;
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
    return this.isPlaybackReady ? this.getMuted() : false;
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
    return this.context.isPlaybackReady;
  }

  get currentSrc(): string {
    return this.context.currentSrc;
  }

  get currentPoster(): string {
    return this.context.currentPoster;
  }

  get duration(): number {
    return this.context.duration;
  }

  get buffered(): number {
    return this.context.buffered;
  }

  get buffering(): boolean {
    return this.context.buffering;
  }

  get playing(): boolean {
    return this.context.playing;
  }

  get started(): boolean {
    return this.context.started;
  }

  get ended(): boolean {
    return this.context.ended;
  }

  get mediaType(): MediaType {
    return this.context.mediaType;
  }

  get isAudio(): boolean {
    return this.context.isAudio;
  }

  get isVideo(): boolean {
    return this.context.isVideo;
  }

  get viewType(): ViewType {
    return this.context.viewType;
  }

  get isAudioView(): boolean {
    return this.context.isAudioView;
  }

  get isVideoView(): boolean {
    return this.context.isVideoView;
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

  /**
   * Player context record. Any property updated inside this object will trigger a context
   * update.
   *
   * @internal - Used for testing.
   */
  @contextRecordProvider(playerContext, transformContextName)
  readonly context!: PlayerContextProvider;

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
