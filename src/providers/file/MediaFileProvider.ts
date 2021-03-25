/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Disposal, listenTo } from '@wcom/events';
import {
  html,
  internalProperty,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';

import {
  CanPlay,
  MediaProvider,
  VdsAbortEvent,
  VdsCanPlayEvent,
  VdsCanPlayThroughEvent,
  VdsDurationChangeEvent,
  VdsEmptiedEvent,
  VdsEndedEvent,
  VdsErrorEvent,
  VdsLoadedDataEvent,
  VdsLoadedMetadataEvent,
  VdsLoadStartEvent,
  VdsPauseEvent,
  VdsPlayEvent,
  VdsPlayingEvent,
  VdsProgressEvent,
  VdsReplayEvent,
  VdsSeekedEvent,
  VdsSeekingEvent,
  VdsStalledEvent,
  VdsStartedEvent,
  VdsSuspendEvent,
  VdsTimeUpdateEvent,
  VdsVolumeChangeEvent,
  VdsWaitingEvent,
} from '../../core';
import { redispatchNativeEvent } from '../../shared/events';
import { Callback } from '../../shared/types';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isNumber, isUndefined } from '../../utils/unit';
import {
  FileProviderMethods,
  FileProviderProps,
  MediaControlsList,
  MediaCrossOriginOption,
  MediaFileProviderEngine,
  MediaPreloadOption,
  NetworkState,
  ReadyState,
  SrcObject,
} from './file.types';

/**
 * Enables loading, playing and controlling media files via the HTML5 MediaElement API. This is
 * used internally by the `vds-audio` and `vds-video` components. This provider only contains
 * glue code so don't bother using it on it's own.
 *
 * @slot Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
export class MediaFileProvider<EngineType = MediaFileProviderEngine>
  extends MediaProvider<EngineType>
  implements FileProviderProps, FileProviderMethods {
  protected mediaEl?: HTMLMediaElement;

  protected disposal = new Disposal();

  firstUpdated(changedProps: PropertyValues): void {
    super.firstUpdated(changedProps);
    this.listenToMediaEvents();
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

  @internalProperty()
  protected _src = '';

  @property()
  get src(): string {
    return this._src;
  }

  set src(newSrc: string) {
    if (this._src !== newSrc) {
      this._src = newSrc;
      this.softResetContext();
      this.handleSrcChange();
      // No other action requried as the `src` attribute should be updated on the underlying
      // `<audio>` or `<video>` element.
    }
  }

  @property({ type: Number })
  height?: number;

  @property({ attribute: 'controlslist' })
  controlsList?: MediaControlsList;

  @property({ attribute: 'crossorigin' })
  crossOrigin?: MediaCrossOriginOption;

  @property({ type: Boolean, attribute: 'defaultmuted' })
  defaultMuted?: boolean;

  @property({ type: Number, attribute: 'defaultplaybackrate' })
  defaultPlaybackRate?: number;

  @property({ type: Boolean, attribute: 'disableremoteplayback' })
  disableRemotePlayback?: boolean;

  @property()
  preload?: MediaPreloadOption = 'metadata';

  @property({ type: Number })
  width?: number;

  get srcObject(): SrcObject | undefined {
    return this.mediaEl?.srcObject ?? undefined;
  }

  set srcObject(newSrcObject: SrcObject | undefined) {
    if (this.mediaEl?.srcObject !== newSrcObject) {
      this.softResetContext();
      this.mediaEl!.srcObject = newSrcObject ?? null;
      if (!this.willAnotherEngineAttach()) this.mediaEl!.load();
      this.handleSrcChange();
    }
  }

  get readyState(): ReadyState {
    return this.mediaEl?.readyState ?? ReadyState.HaveNothing;
  }

  get networkState(): NetworkState {
    return this.mediaEl?.networkState ?? NetworkState.NoSource;
  }

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

    if (this.context.currentTime !== newTime) {
      this.context.currentTime = newTime;
      this.dispatchEvent(new VdsTimeUpdateEvent({ detail: newTime }));
      this.validatePlaybackEndedState();
    }

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
    this.softResetContext();
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
      this.handleSrcChange();
      if (!this.willAnotherEngineAttach()) this.mediaEl?.load();
    });
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected listenToMediaEvents(): void {
    this.disposal.empty();

    if (isNil(this.mediaEl)) return;

    const eventMap: Record<string, Callback<Event>> = {
      abort: this.handleAbort,
      canplay: this.handleCanPlay,
      canplaythrough: this.handleCanPlayThrough,
      durationchange: this.handleDurationChange,
      emptied: this.handleEmptied,
      ended: this.handleEnded,
      error: this.handleError,
      loadeddata: this.handleLoadedData,
      loadedmetadata: this.handleLoadedMetadata,
      loadstart: this.handleLoadStart,
      pause: this.handlePause,
      play: this.handlePlay,
      playing: this.handlePlaying,
      progress: this.handleProgress,
      ratechange: this.handleRateChange,
      seeked: this.handleSeeked,
      seeking: this.handleSeeking,
      stalled: this.handleStalled,
      suspend: this.handleSuspend,
      timeupdate: this.handleTimeUpdate,
      volumechange: this.handleVolumeChange,
      waiting: this.handleWaiting,
    };

    Object.keys(eventMap).forEach(type => {
      const handler = eventMap[type].bind(this);
      this.disposal.add(
        listenTo(this.mediaEl!, type, e => {
          handler(e);
          // re-dispatch native event for spec-compliance.
          redispatchNativeEvent(this, e);
        }),
      );
    });
  }

  protected handleAbort(originalEvent: Event): void {
    this.dispatchEvent(new VdsAbortEvent({ originalEvent }));
  }

  protected handleCanPlay(originalEvent: Event): void {
    this.context.buffered = this.mediaEl!.buffered;
    this.context.seekable = this.mediaEl!.seekable;
    if (!this.willAnotherEngineAttach()) this.mediaReady(originalEvent);
  }

  protected mediaReady(originalEvent?: Event): void {
    this.context.canPlay = true;
    this.dispatchEvent(new VdsCanPlayEvent({ originalEvent }));
    this.flushRequestQueue();
  }

  protected handleCanPlayThrough(originalEvent: Event): void {
    this.context.canPlayThrough = true;
    this.dispatchEvent(new VdsCanPlayThroughEvent({ originalEvent }));
  }

  protected handleLoadStart(originalEvent: Event): void {
    this.context.currentSrc = this.mediaEl!.currentSrc;
    this.dispatchEvent(new VdsLoadStartEvent({ originalEvent }));
  }

  protected handleEmptied(originalEvent: Event): void {
    this.dispatchEvent(new VdsEmptiedEvent({ originalEvent }));
  }

  protected handleLoadedData(originalEvent: Event): void {
    this.dispatchEvent(new VdsLoadedDataEvent({ originalEvent }));
  }

  /**
   * Can be used to indicate another engine such as `hls.js` will attach to the media element
   * so it can handle certain ready events.
   */
  protected willAnotherEngineAttach(): boolean {
    return false;
  }

  protected handleLoadedMetadata(originalEvent: Event): void {
    this.context.duration = this.mediaEl!.duration;
    this.dispatchEvent(
      new VdsDurationChangeEvent({
        detail: this.context.duration,
        originalEvent,
      }),
    );
    this.dispatchEvent(new VdsLoadedMetadataEvent({ originalEvent }));
  }

  protected handlePlay(originalEvent: Event): void {
    this.requestTimeUpdates();
    this.context.paused = false;
    this.dispatchEvent(new VdsPlayEvent({ originalEvent }));
    if (this.context.ended) this.dispatchEvent(new VdsReplayEvent());
    this.validatePlaybackEndedState();
    if (!this.context.started) {
      this.context.started = true;
      this.dispatchEvent(new VdsStartedEvent({ originalEvent }));
    }
  }

  protected handlePause(originalEvent: Event): void {
    this.cancelTimeUpdates();
    this.context.paused = true;
    this.context.playing = false;
    this.context.waiting = false;
    this.dispatchEvent(new VdsPauseEvent({ originalEvent }));
  }

  protected handlePlaying(originalEvent: Event): void {
    this.context.playing = true;
    this.context.waiting = false;
    this.dispatchEvent(new VdsPlayingEvent({ originalEvent }));
  }

  protected handleDurationChange(originalEvent: Event): void {
    this.context.duration = this.mediaEl!.duration;
    this.dispatchEvent(
      new VdsDurationChangeEvent({
        detail: this.context.duration,
        originalEvent,
      }),
    );
  }

  protected handleProgress(originalEvent: Event): void {
    this.context.buffered = this.mediaEl!.buffered;
    this.context.seekable = this.mediaEl!.seekable;
    this.dispatchEvent(new VdsProgressEvent({ originalEvent }));
  }

  protected handleRateChange(): void {
    // TODO: no-op for now but we'll add playback rate support later.
  }

  protected handleSeeked(originalEvent: Event): void {
    this.context.currentTime = this.mediaEl!.currentTime;
    this.context.seeking = false;
    this.validatePlaybackEndedState();
    this.dispatchEvent(
      new VdsSeekedEvent({
        detail: this.context.currentTime,
        originalEvent,
      }),
    );
  }

  protected handleSeeking(originalEvent: Event): void {
    this.context.currentTime = this.mediaEl!.currentTime;
    this.context.seeking = true;
    this.dispatchEvent(
      new VdsSeekingEvent({
        detail: this.context.currentTime,
        originalEvent,
      }),
    );
  }

  /**
   * Override to be notified of source changes.
   */
  protected handleSrcChange(): void {
    // no-op
  }

  protected handleStalled(originalEvent: Event): void {
    this.dispatchEvent(new VdsStalledEvent({ originalEvent }));
  }

  protected handleTimeUpdate(originalEvent: Event): void {
    this.context.currentTime = this.mediaEl!.currentTime;
    this.dispatchEvent(
      new VdsTimeUpdateEvent({
        detail: this.context.currentTime,
        originalEvent,
      }),
    );
  }

  protected handleVolumeChange(originalEvent: Event): void {
    this.context.volume = this.mediaEl!.volume;
    this.context.muted = this.mediaEl!.muted;
    this.dispatchEvent(
      new VdsVolumeChangeEvent({
        detail: {
          volume: this.context.volume,
          muted: this.context.muted,
        },
        originalEvent,
      }),
    );
  }

  protected handleWaiting(originalEvent: Event): void {
    this.context.waiting = true;
    this.dispatchEvent(new VdsWaitingEvent({ originalEvent }));
  }

  protected handleSuspend(originalEvent: Event): void {
    this.context.waiting = false;
    this.dispatchEvent(new VdsSuspendEvent({ originalEvent }));
  }

  protected handleEnded(originalEvent: Event): void {
    // Check becuase might've been handled in `validatePlaybackEnded()`.
    if (!this.context.ended && !this.loop) {
      this.context.ended = true;
      this.dispatchEvent(new VdsEndedEvent({ originalEvent }));
      this.cancelTimeUpdates();
    } else if (this.loop) {
      this.dispatchEvent(new VdsReplayEvent({ originalEvent }));
    }
  }

  protected handleError(originalEvent: Event): void {
    this.context.error = this.mediaEl?.error;
    this.dispatchEvent(
      new VdsErrorEvent({ detail: this.mediaEl!.error, originalEvent }),
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

  get buffered(): TimeRanges {
    if (isNil(this.mediaEl)) return new TimeRanges();
    return this.mediaEl!.buffered;
  }

  get error(): MediaError | undefined {
    return this.mediaEl?.error ?? undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  canPlayType(type: string): CanPlay {
    if (isNil(this.mediaEl)) {
      return CanPlay.No;
    }

    return this.mediaEl.canPlayType(type) as CanPlay;
  }

  async play(): Promise<void> {
    this.throwIfNotReadyForPlayback();
    if (this.context.ended) this.dispatchEvent(new VdsReplayEvent());
    await this.resetPlaybackIfEnded();
    return this.mediaEl!.play();
  }

  async pause(): Promise<void> {
    this.throwIfNotReadyForPlayback();
    return this.mediaEl!.pause();
  }

  captureStream(): MediaStream | undefined {
    this.throwIfNotReadyForPlayback();
    return this.mediaEl!.captureStream?.();
  }

  load(): void {
    this.mediaEl?.load();
  }
}
