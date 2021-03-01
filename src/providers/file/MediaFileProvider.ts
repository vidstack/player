/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listenTo } from '@wcom/events';
import { html, property, PropertyValues, TemplateResult } from 'lit-element';

import {
  MediaProvider,
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
  ProviderDurationChangeEvent,
  ProviderErrorEvent,
  ProviderMutedChangeEvent,
  ProviderPauseEvent,
  ProviderPlaybackEndEvent,
  ProviderPlaybackReadyEvent,
  ProviderPlaybackStartEvent,
  ProviderPlayEvent,
  ProviderPlayingEvent,
  ProviderSrcChangeEvent,
  ProviderTimeChangeEvent,
  ProviderVolumeChangeEvent,
} from '../../core';
import { getSlottedChildren, isNil, isNumber } from '../../utils';
import { MediaCrossOriginOption, MediaPreloadOption } from './file.types';

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class MediaFileProvider extends MediaProvider<HTMLMediaElement> {
  protected mediaEl?: HTMLMediaElement;

  protected disposal = new Disposal();

  protected _isBuffering = false;

  protected _hasPlaybackStarted = false;

  protected _hasPlaybackEnded = false;

  protected _isPlaying = false;

  firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    this.listenToMediaEl();
    this.updateSrc();
  }

  disconnectedCallback(): void {
    this.cancelTimeUpdates();
    this.disposal.empty();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  protected renderContent(): TemplateResult {
    return html`
      <slot @slotchange="${this.handleSlotChange}"></slot>
      Your browser does not support the <code>audio</code> or
      <code>video</code> element.
    `;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  protected _src = '';

  /**
   * The URL of a media resource to use.
   */
  @property()
  get src(): string {
    return this._src;
  }

  set src(newSrc: string) {
    this._src = newSrc;
    this.updateSrc();
  }

  protected updateSrc(): void {
    if (isNil(this.mediaEl)) return;

    if (this._src.length > 0) {
      this.mediaEl.setAttribute('src', this._src);
    } else {
      this.mediaEl.removeAttribute('src');
    }

    this.dispatchEvent(new ProviderSrcChangeEvent({ detail: this._src }));
  }

  // ---

  @property({ type: Number })
  get volume(): number {
    return this.mediaEl?.volume ?? 1;
  }

  set volume(newVolume: number) {
    this.makeRequest('vol', () => {
      this.mediaEl!.volume = newVolume;
    });
  }

  // ---

  @property({ type: Boolean })
  get paused(): boolean {
    return this.mediaEl?.paused ?? true;
  }

  set paused(isPaused: boolean) {
    this.makeRequest('paused', () => {
      if (!isPaused) {
        this.mediaEl!.play();
      } else {
        this.mediaEl!.pause();
      }
    });
  }

  // ---

  @property({ type: Number, attribute: 'current-time' })
  get currentTime(): number {
    return this.mediaEl?.currentTime ?? 0;
  }

  set currentTime(newTime: number) {
    this.makeRequest('time', () => {
      if (this.mediaEl!.currentTime !== newTime) {
        this.mediaEl!.currentTime = newTime;
      }
    });
  }

  // ---

  @property({ type: Boolean })
  get muted(): boolean {
    return this.mediaEl?.muted ?? false;
  }

  set muted(isMuted: boolean) {
    this.makeRequest('muted', () => {
      this.mediaEl!.muted = isMuted;
    });
  }

  // ---

  @property({ type: Boolean })
  controls = false;

  /**
   * The width of the media player.
   */
  @property({ type: Number })
  width?: number;

  /**
   * Whether to use CORS to fetch the related image. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
   * information.
   */
  @property({ attribute: 'cross-origin' })
  crossOrigin?: MediaCrossOriginOption;

  /**
   * Provides a hint to the browser about what the author thinks will lead to the best user
   * experience with regards to what content is loaded before the video is played. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
   * information.
   */
  @property()
  preload?: MediaPreloadOption = 'metadata';

  // -------------------------------------------------------------------------------------------
  // Time Updates
  // The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
  // bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
  // resolve that :)
  // -------------------------------------------------------------------------------------------

  protected timeRAF?: number;

  private cancelTimeUpdates() {
    if (isNumber(this.timeRAF)) window.cancelAnimationFrame(this.timeRAF!);
    this.timeRAF = undefined;
  }

  private requestTimeUpdates() {
    const newTime = this.mediaEl?.currentTime ?? 0;

    this.dispatchEvent(new ProviderTimeChangeEvent({ detail: newTime }));

    this.timeRAF = window.requestAnimationFrame(() => {
      this.requestTimeUpdates();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected async handleSlotChange(): Promise<void> {
    // TODO: remove previous source tags, clone over new ones, call load().
    console.log(getSlottedChildren(this));

    this.cancelTimeUpdates();
    this._isBuffering = false;
    this._hasPlaybackStarted = false;
    this._hasPlaybackEnded = false;
    this.dispatchEvent(new ProviderSrcChangeEvent({ detail: '' }));
  }

  protected listenToMediaEl(): void {
    this.disposal.empty();

    if (isNil(this.mediaEl)) return;

    const listeners = [
      listenTo(
        this.mediaEl,
        'loadedmetadata',
        this.handleLoadedMetadata.bind(this),
      ),
      listenTo(this.mediaEl, 'progress', this.handleProgress.bind(this)),
      listenTo(this.mediaEl, 'timeupdate', this.handleTimeUpdate.bind(this)),
      listenTo(this.mediaEl, 'play', this.handlePlay.bind(this)),
      listenTo(this.mediaEl, 'pause', this.handlePause.bind(this)),
      listenTo(this.mediaEl, 'playing', this.handlePlaying.bind(this)),
      listenTo(
        this.mediaEl,
        'volumechange',
        this.handleVolumeChange.bind(this),
      ),
      listenTo(this.mediaEl, 'waiting', this.handleWaiting.bind(this)),
      listenTo(this.mediaEl, 'suspend', this.handleSuspend.bind(this)),
      listenTo(this.mediaEl, 'ended', this.handleEnded.bind(this)),
      listenTo(this.mediaEl, 'error', this.handleError.bind(this)),
    ];

    listeners.forEach(off => this.disposal.add(off));
  }

  protected handleLoadedMetadata(originalEvent: Event): void {
    this.requestTimeUpdates();

    this.dispatchEvent(
      new ProviderDurationChangeEvent({
        detail: this.duration,
        originalEvent,
      }),
    );

    this.dispatchEvent(
      new ProviderPlaybackReadyEvent({
        originalEvent,
      }),
    );
  }

  protected handlePlay(originalEvent: Event): void {
    this.requestTimeUpdates();

    this.dispatchEvent(
      new ProviderPlayEvent({
        originalEvent,
      }),
    );

    if (!this._hasPlaybackStarted) {
      this._hasPlaybackStarted = true;
      this.dispatchEvent(
        new ProviderPlaybackStartEvent({
          originalEvent,
        }),
      );
    }
  }

  protected handlePause(originalEvent: Event): void {
    this.cancelTimeUpdates();

    this._isPlaying = false;

    this.dispatchEvent(
      new ProviderPauseEvent({
        originalEvent,
      }),
    );

    this._isBuffering = false;
    this.dispatchEvent(
      new ProviderBufferingChangeEvent({
        detail: false,
        originalEvent,
      }),
    );
  }

  protected handlePlaying(originalEvent: Event): void {
    this._isPlaying = true;

    this.dispatchEvent(
      new ProviderPlayingEvent({
        originalEvent,
      }),
    );

    this._isBuffering = false;
    this.dispatchEvent(
      new ProviderBufferingChangeEvent({
        detail: false,
        originalEvent,
      }),
    );
  }

  protected handleDurationChange(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderDurationChangeEvent({
        detail: this.duration,
        originalEvent,
      }),
    );
  }

  protected handleProgress(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderBufferedChangeEvent({
        detail: this.buffered,
        originalEvent,
      }),
    );
  }

  protected handleTimeUpdate(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderTimeChangeEvent({
        detail: this.currentTime,
        originalEvent,
      }),
    );
  }

  protected handleVolumeChange(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderVolumeChangeEvent({
        detail: this.volume,
        originalEvent,
      }),
    );

    this.dispatchEvent(
      new ProviderMutedChangeEvent({
        detail: this.muted,
        originalEvent,
      }),
    );
  }

  protected handleWaiting(originalEvent: Event): void {
    this._isBuffering = true;
    this.dispatchEvent(
      new ProviderBufferingChangeEvent({
        detail: true,
        originalEvent,
      }),
    );
  }

  protected handleSuspend(originalEvent: Event): void {
    this._isBuffering = false;
    this.dispatchEvent(
      new ProviderBufferingChangeEvent({
        detail: false,
        originalEvent,
      }),
    );
  }

  protected handleEnded(originalEvent: Event): void {
    this._hasPlaybackEnded = true;
    this.dispatchEvent(
      new ProviderPlaybackEndEvent({
        originalEvent,
      }),
    );
  }

  protected handleError(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderErrorEvent({
        detail: originalEvent,
        originalEvent,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get isPlaybackReady(): boolean {
    return !isNil(this.mediaEl!) && this.mediaEl!.readyState >= 1;
  }

  get currentSrc(): string {
    return this.mediaEl!.currentSrc;
  }

  get currentPoster(): string {
    return '';
  }

  get internalPlayer(): HTMLMediaElement | undefined {
    return this.mediaEl;
  }

  get duration(): number {
    return this.mediaEl?.duration ?? -1;
  }

  get buffered(): number {
    if (isNil(this.mediaEl)) return 0;
    const { buffered, duration } = this.mediaEl;
    const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
    return end > duration ? duration : end;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get isBuffering(): boolean {
    return this._isBuffering;
  }

  get hasPlaybackStarted(): boolean {
    return this._hasPlaybackStarted;
  }

  get hasPlaybackEnded(): boolean {
    return this._hasPlaybackEnded;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): boolean {
    return this.mediaEl?.canPlayType(type) === 'probably';
  }

  async play(): Promise<void> {
    this.throwIfNotReady();
    return this.mediaEl!.play();
  }

  async pause(): Promise<void> {
    this.throwIfNotReady();
    return this.mediaEl!.pause();
  }

  protected throwIfNotReady(): void {
    if (isNil(this.mediaEl)) {
      throw Error('Media element is not ready.');
    }
  }
}
