import {
  contextRecordProvider,
  DerivedContext,
  provideContextRecord,
} from '@wcom/context';
import { listen } from '@wcom/events';
import { LitElement, property, PropertyValues } from 'lit-element';

import { deferredPromise } from '../../utils/promise';
import { isString, isUndefined } from '../../utils/unit';
import { CanPlay } from '../CanPlay';
import { DeviceObserverMixin } from '../device/DeviceObserverMixin';
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
  VdsErrorEvent,
  VdsViewTypeChangeEvent,
} from '../player.events';
import { PlayerMethods, PlayerProps } from '../player.types';
import {
  VdsUserMutedChange,
  VdsUserPauseEvent,
  VdsUserPlayEvent,
  VdsUserSeeked,
  VdsUserVolumeChange,
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
  // Methods
  // -------------------------------------------------------------------------------------------

  protected throwIfNotReadyForPlayback(): void {
    if (!this.canPlay) {
      throw Error(
        `Media is not ready - wait for \`${VdsCanPlayEvent.TYPE}\` event.`,
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
    return this.canPlay ? 'false' : 'true';
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

  @listen(VdsUserMutedChange.TYPE)
  protected handleUserMuteChange(e: VdsUserMutedChange): void {
    this.userEventGateway(e);
    this.muted = e.detail;
  }

  @listen(VdsUserSeeked.TYPE)
  protected handleUserSeeked(e: VdsUserSeeked): void {
    this.userEventGateway(e);
    this.currentTime = e.detail;
  }

  @listen(VdsUserVolumeChange.TYPE)
  protected handleUserVolumeChange(e: VdsUserVolumeChange): void {
    this.userEventGateway(e);
    this.volume = e.detail;
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Requests are queued if called before media is ready for playback. Once the media is
   * ready (`PlaybackReadyEvent`) the queue is flushed. Each request is associated with
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
   * @internal - Used internally to keep `MediaProvider` and UI in sync with engine state.
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
