/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listenTo } from '@wcom/events';
import { html, property, PropertyValues, TemplateResult } from 'lit-element';

import {
  BufferedChangeEvent,
  BufferingChangeEvent,
  DurationChangeEvent,
  ErrorEvent,
  MediaProvider,
  MutedChangeEvent,
  PauseEvent,
  PlaybackEndEvent,
  PlaybackReadyEvent,
  PlaybackStartEvent,
  PlayEvent,
  PlayingEvent,
  SrcChangeEvent,
  TimeChangeEvent,
  VolumeChangeEvent,
} from '../../core';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isNumber, isUndefined } from '../../utils/unit';
import {
  CanPlayTypeResult,
  MediaCrossOriginOption,
  MediaFileProviderEngine,
  MediaPreloadOption,
  ReadyState,
} from './file.types';

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class MediaFileProvider<
  EngineType = MediaFileProviderEngine
> extends MediaProvider<EngineType> {
  protected mediaEl?: HTMLMediaElement;

  protected disposal = new Disposal();

  protected _isBuffering = false;

  protected _hasPlaybackStarted = false;

  protected _hasPlaybackEnded = false;

  protected _isPlaying = false;

  firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    this.listenToMediaEl();
  }

  disconnectedCallback(): void {
    this.cancelTimeUpdates();
    this.disposal.empty();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to modify the content rendered inside `<audio>` and `<video>` elements.
   */
  protected renderMediaContent(): TemplateResult {
    return html`
      <slot @slotchange="${this.handleDefaultSlotChange}"></slot>
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
    this.dispatchEvent(new SrcChangeEvent({ detail: this._src }));
    this.requestUpdate();
  }

  /**
   * The width of the media player.
   */
  @property({ type: Number })
  width?: number;

  /**
   * The height of the media player.
   */
  @property({ type: Number })
  height?: number;

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

    this.dispatchEvent(new TimeChangeEvent({ detail: newTime }));

    this.timeRAF = window.requestAnimationFrame(() => {
      if (isUndefined(this.timeRAF)) return;
      this.requestTimeUpdates();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Slots
  // -------------------------------------------------------------------------------------------

  protected handleDefaultSlotChange(): void {
    if (isNil(this.mediaEl)) return;
    this.cancelTimeUpdates();
    this.cleanupOldSourceNodes();
    this._isBuffering = false;
    this._hasPlaybackStarted = false;
    this._hasPlaybackEnded = false;
    this.dispatchEvent(new SrcChangeEvent({ detail: '' }));
    this.attachNewSourceNodes();
  }

  protected cleanupOldSourceNodes(): void {
    const nodes = this.mediaEl?.querySelectorAll('source,track');
    nodes?.forEach(node => node.remove());
  }

  protected attachNewSourceNodes(): void {
    const validTags = new Set(['source', 'track']);

    getSlottedChildren(this)
      .filter(node => validTags.has(node.tagName.toLowerCase()))
      .forEach(node => this.mediaEl?.appendChild(node.cloneNode()));

    window.requestAnimationFrame(() => {
      this.mediaEl?.load();
    });
  }

  /**
   * Can be used by extending class to override `isPlaybackReady`.
   */
  protected isMediaElReadyForPlayback(): boolean {
    return (
      !isNil(this.mediaEl) &&
      this.mediaEl!.readyState >= ReadyState.HaveMetaData
    );
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected listenToMediaEl(): void {
    this.disposal.empty();

    if (isNil(this.mediaEl)) return;

    const listeners = [
      listenTo(this.mediaEl, 'loadstart', this.handleLoadStart.bind(this)),
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

  protected handleLoadStart(originalEvent: Event): void {
    this.dispatchEvent(
      new SrcChangeEvent({ detail: this.currentSrc, originalEvent }),
    );
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   */
  protected willAnotherEngineAttach(): boolean {
    return false;
  }

  protected handleLoadedMetadata(originalEvent: Event): void {
    this.requestTimeUpdates();

    if (this.willAnotherEngineAttach()) return;

    this.dispatchEvent(
      new DurationChangeEvent({ detail: this.duration, originalEvent }),
    );

    this.dispatchEvent(new PlaybackReadyEvent({ originalEvent }));
  }

  protected handlePlay(originalEvent: Event): void {
    this.requestTimeUpdates();

    this.dispatchEvent(new PlayEvent({ originalEvent }));

    if (!this._hasPlaybackStarted) {
      this._hasPlaybackStarted = true;
      this.dispatchEvent(new PlaybackStartEvent({ originalEvent }));
    }
  }

  protected handlePause(originalEvent: Event): void {
    this.cancelTimeUpdates();

    this._isPlaying = false;

    this.dispatchEvent(new PauseEvent({ originalEvent }));

    this._isBuffering = false;
    this.dispatchEvent(
      new BufferingChangeEvent({ detail: false, originalEvent }),
    );
  }

  protected handlePlaying(originalEvent: Event): void {
    this._isPlaying = true;

    this.dispatchEvent(new PlayingEvent({ originalEvent }));

    this._isBuffering = false;
    this.dispatchEvent(
      new BufferingChangeEvent({ detail: false, originalEvent }),
    );
  }

  protected handleDurationChange(originalEvent: Event): void {
    this.dispatchEvent(
      new DurationChangeEvent({ detail: this.duration, originalEvent }),
    );
  }

  protected handleProgress(originalEvent: Event): void {
    this.dispatchEvent(
      new BufferedChangeEvent({ detail: this.buffered, originalEvent }),
    );
  }

  protected handleTimeUpdate(originalEvent: Event): void {
    this.dispatchEvent(
      new TimeChangeEvent({ detail: this.currentTime, originalEvent }),
    );
  }

  protected handleVolumeChange(originalEvent: Event): void {
    this.dispatchEvent(
      new VolumeChangeEvent({ detail: this.volume, originalEvent }),
    );

    this.dispatchEvent(
      new MutedChangeEvent({ detail: this.muted, originalEvent }),
    );
  }

  protected handleWaiting(originalEvent: Event): void {
    this._isBuffering = true;
    this.dispatchEvent(
      new BufferingChangeEvent({ detail: true, originalEvent }),
    );
  }

  protected handleSuspend(originalEvent: Event): void {
    this._isBuffering = false;
    this.dispatchEvent(
      new BufferingChangeEvent({ detail: false, originalEvent }),
    );
  }

  protected handleEnded(originalEvent: Event): void {
    this._hasPlaybackEnded = true;
    this.dispatchEvent(new PlaybackEndEvent({ originalEvent }));
  }

  protected handleError(originalEvent: Event): void {
    this.dispatchEvent(
      new ErrorEvent({ detail: originalEvent, originalEvent }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Provider Methods
  // -------------------------------------------------------------------------------------------

  protected getPaused(): boolean {
    return this.mediaEl!.paused;
  }

  protected getVolume(): number {
    return this.mediaEl!.volume;
  }

  protected setVolume(newVolume: number): void {
    this.mediaEl!.volume = newVolume;
  }

  protected getCurrentTime(): number {
    return this.mediaEl!.currentTime;
  }

  protected setCurrentTime(newTime: number): void {
    if (this.mediaEl!.currentTime !== newTime) {
      this.mediaEl!.currentTime = newTime;
    }
  }

  protected getMuted(): boolean {
    return this.mediaEl!.muted;
  }

  protected setMuted(isMuted: boolean): void {
    this.mediaEl!.muted = isMuted;
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine(): EngineType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.mediaEl as any;
  }

  get isPlaybackReady(): boolean {
    return this.isMediaElReadyForPlayback();
  }

  get currentSrc(): string {
    return this.mediaEl?.currentSrc ?? '';
  }

  get currentPoster(): string {
    return '';
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
    if (isNil(this.mediaEl)) {
      return false;
    }

    return (
      this.mediaEl.canPlayType(type) === CanPlayTypeResult.Probably ||
      this.mediaEl.canPlayType(type) === CanPlayTypeResult.Maybe
    );
  }

  async play(): Promise<void> {
    this.throwIfNotReady();
    return this.mediaEl!.play();
  }

  async pause(): Promise<void> {
    this.throwIfNotReady();
    return this.mediaEl!.pause();
  }
}
