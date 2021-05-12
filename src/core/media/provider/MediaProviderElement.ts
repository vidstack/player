import { DerivedContext } from '@wcom/context';
import { Disposal } from '@wcom/events';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators';

import { isUndefined } from '../../../utils/unit';
import {
  FullscreenController,
  FullscreenControllerHost,
} from '../../fullscreen';
import { RequestQueue } from '../../queue';
import {
  ScreenOrientationController,
  ScreenOrientationControllerHost,
  ScreenOrientationLock,
} from '../../screen-orientation';
import { CanPlay } from '../CanPlay';
import {
  mediaContext,
  mediaContextRecord,
  softResettableMediaContextProps,
} from '../media.context';
import {
  VdsCanPlayEvent,
  VdsEndedEvent,
  VdsErrorEvent,
  VdsFullscreenChangeEvent,
  VdsSuspendEvent,
} from '../media.events';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';
import { VdsMediaProviderConnectEvent } from './media-provider.events';
import {
  MediaProviderElementMethods,
  MediaProviderElementProps,
} from './media-provider.types';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 */
export abstract class MediaProviderElement<EngineType = unknown>
  extends LitElement
  implements
    MediaProviderElementProps,
    MediaProviderElementMethods,
    FullscreenControllerHost,
    ScreenOrientationControllerHost {
  protected disconnectDisposal = new Disposal();

  connectedCallback(): void {
    super.connectedCallback();
    this.addFullscreenController(this.fullscreenController);
    this.dispatchEvent(
      new VdsMediaProviderConnectEvent({
        detail: {
          provider: this,
          onDisconnect: callback => {
            this.disconnectDisposal.add(callback);
          },
        },
      }),
    );

    this.contextQueue.flush();
    this.contextQueue.serveImmediately = true;
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

    super.updated(changedProperties);
  }

  disconnectedCallback(): void {
    this.disconnectDisposal.empty();
    this.contextQueue.destroy();
    this.mediaRequestQueue.destroy();
    this.hardResetMediaContext();
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
    this.mediaRequestQueue.queue('volume', () => {
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
    this.mediaRequestQueue.queue('paused', () => {
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
    this.mediaRequestQueue.queue('time', () => {
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
    this.mediaRequestQueue.queue('muted', () => {
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

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying engine that is actually responsible for rendering/loading media. Some examples
   * are:
   *
   * - The `VideoElement` engine is `HTMLMediaElement`.
   * - The `HlsElement` engine is the `hls.js` instance.
   * - The `YoutubeElement` engine is `HTMLIFrameElement`.
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

  get error(): unknown | undefined {
    return this.context.error;
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

  get seeking(): boolean {
    return this.context.seeking;
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
  // Playback
  // -------------------------------------------------------------------------------------------

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;

  protected throwIfNotReadyForPlayback(): void {
    if (!this.canPlay) {
      throw Error(
        `Media is not ready - wait for \`${VdsCanPlayEvent.TYPE}\` event.`,
      );
    }
  }

  protected hasPlaybackRoughlyEnded(): boolean {
    if (isNaN(this.duration) || this.duration === 0) return false;
    return (
      Math.abs(
        Math.round(this.duration * 10) - Math.round(this.currentTime * 10),
      ) <= 1
    );
  }

  /**
   * Call if you suspect that playback might have resumed/ended again.
   */
  protected validatePlaybackEndedState(): void {
    if (this.context.ended && !this.hasPlaybackRoughlyEnded()) {
      this.context.ended = false;
    } else if (!this.context.ended && this.hasPlaybackRoughlyEnded()) {
      this.context.waiting = false;
      this.dispatchEvent(new VdsSuspendEvent());
      this.context.ended = true;
      this.dispatchEvent(new VdsEndedEvent());
    }
  }

  protected async resetPlayback(): Promise<void> {
    this.setCurrentTime(0);
  }

  protected async resetPlaybackIfEnded(): Promise<void> {
    if (!this.hasPlaybackRoughlyEnded()) return;
    return this.resetPlayback();
  }

  protected throwIfNotVideoView(): void {
    if (!this.context.isVideoView) {
      throw Error('Player is currently not in a video view.');
    }
  }

  protected handleMediaReady(originalEvent?: Event): void {
    this.context.canPlay = true;
    this.dispatchEvent(new VdsCanPlayEvent({ originalEvent }));
    this.mediaRequestQueue.flush();
    this.mediaRequestQueue.serveImmediately = true;
  }

  protected handleMediaSrcChange(): void {
    this.mediaRequestQueue.serveImmediately = false;
    this.mediaRequestQueue.reset();
    this.softResetMediaContext();
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be applied to any context safely after the element has connected to the
   * DOM.
   */
  protected contextQueue = new RequestQueue();

  /**
   * Any property updated inside this object will trigger a context update. The media controller
   * will provide (inject) the context record to be managed by this media provider. Any updates here
   * will flow down from the media controller to all components.
   *
   * If there's no media controller then this will be a plain JS object that's used to keep
   * track of media state.
   *
   * @state Exposed for testing.
   */
  @mediaContextRecord.consume()
  readonly context = mediaContextRecord.defaultValue;

  /**
   * Media context properties that should be reset when media is changed. Override this
   * to include additional properties.
   */
  protected getSoftResettableMediaContextProps(): Set<string> {
    return softResettableMediaContextProps;
  }

  /**
   * When the `currentSrc` is changed this method is called to update any context properties
   * that need to be reset. Important to note that not all properties are reset, only the
   * properties returned from `getSoftResettableMediaContextProps()`.
   */
  protected softResetMediaContext(): void {
    const softResettable = this.getSoftResettableMediaContextProps();
    Object.keys(mediaContext).forEach(prop => {
      if (softResettable.has(prop)) {
        this.context[prop] = mediaContext[prop].defaultValue;
      }
    });
  }

  /**
   * Called when the provider disconnects, resets the media context completely.
   */
  protected hardResetMediaContext(): void {
    Object.keys(mediaContext).forEach(prop => {
      // We can't set values on a derived context.
      if (isUndefined((mediaContext[prop] as DerivedContext<unknown>).key)) {
        this.context[prop] = mediaContext[prop].defaultValue;
      }
    });
  }

  // -------------------------------------------------------------------------------------------
  // Request Queue
  // -------------------------------------------------------------------------------------------

  /**
   * Queue actions to be taken on the current media provider when it's ready for playback, marked
   * by the `canPlay` property. If the media provider is ready, actions will be invoked immediately.
   */
  mediaRequestQueue = new RequestQueue();

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  screenOrientationController = new ScreenOrientationController(this);

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  fullscreenController = new FullscreenController(
    this,
    this.screenOrientationController,
  );

  get canRequestFullscreen(): boolean {
    return this.fullscreenController.isSupported;
  }

  get fullscreen(): boolean {
    return this.fullscreenController.isFullscreen;
  }

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  @property({ attribute: 'fullscreen-orientation' })
  get fullscreenOrientation(): ScreenOrientationLock | undefined {
    return this.fullscreenController.screenOrientationLock;
  }

  set fullscreenOrientation(lockType: ScreenOrientationLock | undefined) {
    this.fullscreenController.screenOrientationLock = lockType;
  }

  requestFullscreen(): Promise<void> {
    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  exitFullscreen(): Promise<void> {
    return this.fullscreenController.exitFullscreen();
  }

  /**
   * This can be used to add additional fullscreen controller event listeners to update the
   * appropriate contexts and dispatch events.
   */
  addFullscreenController(controller: FullscreenController): void {
    // NOTE: Events are cleaned up automatically when the controller's host element is disconnected.

    controller.addEventListener('fullscreen-change', e => {
      const isFullscreen = e.detail;
      this.context.fullscreen = isFullscreen;
      this.dispatchEvent(
        new VdsFullscreenChangeEvent({
          detail: isFullscreen,
          originalEvent: e.originalEvent,
        }),
      );
    });

    controller.addEventListener('error', e => {
      const error = e.detail;
      this.context.error = error;
      this.dispatchEvent(
        new VdsErrorEvent({
          detail: error,
          originalEvent: e.originalEvent,
        }),
      );
    });
  }
}
