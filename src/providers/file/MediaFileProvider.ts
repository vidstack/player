/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listenTo } from '@wcom/events';
import { html, property, query, TemplateResult } from 'lit-element';
import {
  MediaProvider,
  MediaType,
  PlayerState,
  ProviderBufferedChangeEvent,
  ProviderBufferingChangeEvent,
  ProviderCurrentSrcChangeEvent,
  ProviderDurationChangeEvent,
  ProviderErrorEvent,
  ProviderMutedChangeEvent,
  ProviderPauseEvent,
  ProviderPlaybackEndEvent,
  ProviderPlaybackReadyEvent,
  ProviderPlaybackStartEvent,
  ProviderPlayEvent,
  ProviderPlayingEvent,
  ProviderTimeChangeEvent,
  ProviderVolumeChangeEvent,
  ViewType,
} from '../../core';
import { isNumber, isUndefined } from '../../utils';
import { MediaCrossOriginOption, MediaPreloadOption } from './file.types';

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class MediaFileProvider extends MediaProvider<HTMLMediaElement> {
  @query('.mediaEl', true)
  protected mediaEl!: HTMLMediaElement;

  protected disposal = new Disposal();

  protected viewType = ViewType.Unknown;

  protected mediaType = MediaType.Unknown;

  protected _isBuffering = false;

  protected _hasPlaybackStarted = false;

  protected _hasPlaybackEnded = false;

  disconnectedCallback(): void {
    this.cancelTimeUpdates();
    this.disposal.empty();
    super.disconnectedCallback();
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------------------------------
   */

  protected renderContent(): TemplateResult {
    return html`
      <slot @slotchange="${this.handleSlotChange}"></slot>
      Your browser does not support the <code>audio</code> or
      <code>video</code> element.
    `;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Properties
   * -------------------------------------------------------------------------------------------
   */

  /**
   * Whether to use CORS to fetch the related image. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
   * information.
   */
  @property()
  crossOrigin?: MediaCrossOriginOption;

  /**
   * Provides a hint to the browser about what the author thinks will lead to the best user
   * experience with regards to what content is loaded before the video is played. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
   * information.
   */
  @property()
  preload?: MediaPreloadOption;

  /**
   * -------------------------------------------------------------------------------------------
   * Time Updates
   *
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that :)
   * -------------------------------------------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------------------------------------------
   * Events
   * -------------------------------------------------------------------------------------------
   */

  protected handleSlotChange(): void {
    this.cancelTimeUpdates();
    this._isBuffering = false;
    this._hasPlaybackStarted = false;
    this._hasPlaybackEnded = false;
    this.mediaEl.load();
    this.dispatchEvent(new ProviderCurrentSrcChangeEvent({ detail: '' }));
  }

  protected listenToMediaEl(): void {
    this.disposal.empty();

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
      new ProviderCurrentSrcChangeEvent({
        detail: this.getCurrentSrc(),
        originalEvent,
      }),
    );

    this.dispatchEvent(
      new ProviderDurationChangeEvent({
        detail: this.getDuration(),
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
        detail: this.getDuration(),
        originalEvent,
      }),
    );
  }

  protected handleProgress(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderBufferedChangeEvent({
        detail: this.getBuffered(),
        originalEvent,
      }),
    );
  }

  protected handleTimeUpdate(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderTimeChangeEvent({
        detail: this.getCurrentTime(),
        originalEvent,
      }),
    );
  }

  protected handleVolumeChange(originalEvent: Event): void {
    this.dispatchEvent(
      new ProviderVolumeChangeEvent({
        detail: this.getVolume(),
        originalEvent,
      }),
    );

    this.dispatchEvent(
      new ProviderMutedChangeEvent({
        detail: this.isMuted(),
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

  /**
   * -------------------------------------------------------------------------------------------
   * Getters + Setters
   * -------------------------------------------------------------------------------------------
   */

  getVolume(): PlayerState['volume'] {
    return this.mediaEl.volume;
  }

  setVolume(newVolume: PlayerState['volume']): void {
    this.mediaEl.volume = newVolume;
  }

  getCurrentTime(): PlayerState['currentTime'] {
    return this.mediaEl.currentTime;
  }

  setCurrentTime(newTime: PlayerState['currentTime']): void {
    this.mediaEl.currentTime = newTime;
  }

  isMuted(): PlayerState['muted'] {
    return this.mediaEl.muted;
  }

  setMuted(isMuted: PlayerState['muted']): void {
    this.mediaEl.muted = isMuted;
  }

  isControlsVisible(): PlayerState['controls'] {
    return this.mediaEl.controls;
  }

  setControlsVisibility(isVisible: PlayerState['controls']): void {
    this.mediaEl.controls = isVisible;
  }

  isPlaybackReady(): PlayerState['isPlaybackReady'] {
    return !isUndefined(this.mediaEl) && this.mediaEl.readyState === 1;
  }

  isPaused(): PlayerState['paused'] {
    return this.mediaEl.paused;
  }

  getCurrentSrc(): PlayerState['currentSrc'] {
    return this.mediaEl.currentSrc;
  }

  getPoster(): PlayerState['poster'] {
    return '';
  }

  getInternalPlayer(): HTMLMediaElement {
    return this.mediaEl;
  }

  getViewType(): PlayerState['viewType'] {
    return this.viewType;
  }

  getMediaType(): PlayerState['mediaType'] {
    return this.mediaType;
  }

  getDuration(): PlayerState['duration'] {
    return this.mediaEl.duration;
  }

  getBuffered(): PlayerState['buffered'] {
    const { buffered, duration } = this.mediaEl;
    const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
    return end > duration ? duration : end;
  }

  isBuffering(): PlayerState['isBuffering'] {
    return this._isBuffering;
  }

  hasPlaybackStarted(): PlayerState['hasPlaybackStarted'] {
    return this._hasPlaybackStarted;
  }

  hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
    return this._hasPlaybackEnded;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Methods
   * -------------------------------------------------------------------------------------------
   */

  canPlayType(type: string): boolean {
    return this.mediaEl.canPlayType(type) === 'probably';
  }

  async play(): Promise<void> {
    return this.mediaEl.play();
  }

  async pause(): Promise<void> {
    return this.mediaEl.pause();
  }
}
