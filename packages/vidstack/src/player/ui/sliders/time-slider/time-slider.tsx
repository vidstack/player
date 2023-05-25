import throttle from 'just-throttle';
import { effect, peek, provideContext, signal } from 'maverick.js';
import {
  ComponentInstance,
  defineElement,
  defineProp,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { listenEvent, setAttribute } from 'maverick.js/std';
import type { VTTCue } from 'media-captions';

import { ClassManager } from '../../../../foundation/observers/class-manager';
import { scopedRaf, setAttributeIfEmpty } from '../../../../utils/dom';
import { round } from '../../../../utils/number';
import { formatSpokenTime, formatTime } from '../../../../utils/time';
import type { TextTrack } from '../../../core/tracks/text/text-track';
import { onTrackChapterChange } from '../../../core/tracks/text/utils';
import type { SliderCSSVars } from '../slider/api/cssvars';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from '../slider/api/events';
import { sliderProps, type SliderProps } from '../slider/api/props';
import { SliderStoreFactory } from '../slider/api/store';
import { sliderValueFormatContext } from '../slider/format';
import { Slider, type SliderAPI } from '../slider/slider';
import { SliderChaptersRenderer } from './chapters';

declare global {
  interface MaverickElements {
    'media-time-slider': MediaTimeSliderElement;
  }
}

/**
 * A slider control that lets the user specify their desired time level.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/time-slider}
 * @slot preview - Used to insert a slider preview.
 * @example
 * ```html
 * <media-time-slider></media-time-slider>
 * ```
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-value
 *     type="pointer"
 *     format="time"
 *     slot="preview"
 *   ></media-slider-value>
 * </media-time-slider>
 * ```
 */
export class TimeSlider extends Slider<TimeSliderAPI> {
  static override el = defineElement<TimeSliderAPI>({
    tagName: 'media-time-slider',
    props: {
      ...sliderProps,
      min: defineProp({ value: 0, attribute: false }),
      max: defineProp({ value: 100, attribute: false }),
      value: defineProp({ value: 0, attribute: false }),
      pauseWhileDragging: false,
      seekingRequestThrottle: 100,
      chaptersClass: null,
      chapterContainerClass: null,
      chapterClass: null,
    },
    store: SliderStoreFactory,
  });

  protected override _readonly = true;
  protected _swipeGesture = true;

  protected _dispatchSeeking!: ThrottledSeeking;
  protected _track = signal<TextTrack | null>(null);
  protected _chaptersRenderer!: SliderChaptersRenderer;
  protected _classManager?: ClassManager;

  constructor(instance: ComponentInstance<TimeSliderAPI>) {
    super(instance);
    provideContext(sliderValueFormatContext, {
      value: this._formatValue.bind(this),
      time: this._formatTime.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'aria-label', 'Media time');
    super.onAttach(el);

    this._chaptersRenderer = new SliderChaptersRenderer(
      this._media.$store,
      this.$store,
      this._chapterTitle.set,
    );

    this.setAttributes({
      'data-chapters': this._hasChapters.bind(this),
    });

    this.setStyles({
      '--media-buffered-percent': this._calcBufferedPercent.bind(this),
    });

    effect(this._watchCurrentTime.bind(this));
    effect(this._watchSeekingThrottle.bind(this));
    effect(this._onTrackChange.bind(this));

    scopedRaf(() => {
      effect(this._watchPreviewing.bind(this));
    });
  }

  protected _calcBufferedPercent() {
    const { bufferedEnd, duration } = this._media.$store;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + '%';
  }

  protected _hasChapters() {
    const { duration } = this._media.$store;
    this._classManager?._requestUpdate();
    return this._track()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }

  protected override onConnect(el: HTMLElement) {
    super.onConnect(el);

    this._onTrackModeChange();
    listenEvent(this._media.textTracks, 'mode-change', this._onTrackModeChange.bind(this));

    const { chapterContainerClass, chapterClass, trackClass, trackFillClass, trackProgressClass } =
      this.$props;
    this._classManager = new ClassManager(el)
      ._observe('[part="chapter-container"]', chapterContainerClass)
      ._observe('[part="chapter"]', chapterClass)
      ._observe('[part="track"]', trackClass)
      ._observe('[part~="track-fill"]', trackFillClass)
      ._observe('[part~="track-progress"]', trackProgressClass);
  }

  override render() {
    const tracks = super.render(),
      { chaptersClass } = this.$props;
    return (
      <>
        {this._chaptersRenderer.render(this._track()?.cues, chaptersClass)}
        {tracks}
      </>
    );
  }

  protected _watchSeekingThrottle() {
    this._dispatchSeeking = throttle(
      this._seeking.bind(this),
      this.$props.seekingRequestThrottle(),
    );
  }

  protected _watchCurrentTime() {
    const { currentTime } = this._media.$store,
      { value, dragging } = this.$store,
      newValue = this._timeToPercent(currentTime());
    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch('value-change', { detail: newValue });
    }
  }

  protected _watchPreviewing() {
    const player = this._media.player;
    player && this._preview && setAttribute(player, 'data-preview', this.$store.interactive());
  }

  protected _seeking(time: number, event: Event) {
    this._media.remote.seeking(time, event);
  }

  protected _seek(time: number, percent: number, event: Event) {
    this._dispatchSeeking.cancel();

    const { live } = this._media.$store;
    if (live() && percent >= 99) {
      this._media.remote.seekToLiveEdge(event);
      return;
    }

    this._media.remote.seek(time, event);
  }

  protected _playingBeforeDragStart = false;
  override _onDragStart(event: SliderDragStartEvent) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this._media.$store;
      this._playingBeforeDragStart = !paused();
      this._media.remote.pause(event);
    }
  }

  override _onDragValueChange(event: SliderDragValueChangeEvent) {
    this._dispatchSeeking(this._percentToTime(event.detail), event);
  }

  override _onDragEnd(event: SliderValueChangeEvent | SliderDragEndEvent) {
    const percent = event.detail;
    this._seek(this._percentToTime(percent), percent, event);

    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this._playingBeforeDragStart) {
      this._media.remote.play(event);
      this._playingBeforeDragStart = false;
    }
  }

  override _onValueChange(event: SliderValueChangeEvent) {
    const { dragging } = this.$store;
    if (dragging() || !event.trigger) return;
    this._onDragEnd(event);
  }

  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------

  override _getStep() {
    const value = (this.$props.step() / this._media.$store.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  override _getKeyStep() {
    const value = (this.$props.keyStep() / this._media.$store.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  override _roundValue(value: number) {
    return round(value, 3);
  }

  override _isDisabled() {
    const { canSeek } = this._media.$store;
    return super._isDisabled() || !canSeek();
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  protected override _getARIAValueMin(): number {
    return 0;
  }

  protected override _getARIAValueMax(): number {
    return 100;
  }

  protected override _getARIAValueText(): string {
    const time = this._percentToTime(this.$store.value()),
      { duration } = this._media.$store;
    return Number.isFinite(time)
      ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}`
      : 'live';
  }

  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------

  protected _percentToTime(percent: number) {
    const { duration } = this._media.$store;
    return Math.round((percent / 100) * duration());
  }

  protected _timeToPercent(time: number) {
    const { liveEdge, duration } = this._media.$store,
      rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }

  protected _formatValue(percent: number) {
    const time = this._percentToTime(percent),
      { live, duration } = this._media.$store;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : 'LIVE';
  }

  protected _formatTime(
    percent: number,
    padHours: boolean,
    padMinutes: boolean,
    showHours: boolean,
  ) {
    const time = this._percentToTime(percent),
      { live, duration } = this._media.$store,
      value = live() ? time - duration() : time;
    return Number.isFinite(time)
      ? `${value < 0 ? '-' : ''}${formatTime(Math.abs(value), padHours, padMinutes, showHours)}`
      : 'LIVE';
  }

  // -------------------------------------------------------------------------------------------
  // Chapters
  // -------------------------------------------------------------------------------------------

  protected _chapterTitleEl: HTMLElement | null = null;
  protected _chapterTitle = signal<string>('');

  protected _onTrackModeChange() {
    onTrackChapterChange(this._media.textTracks, peek(this._track), this._track.set);
  }

  protected _onTrackChange() {
    this._track();
    this._chapterTitleEl = this.el?.querySelector('[part="chapter-title"]') ?? null;
    if (!this._chapterTitleEl) return;
    effect(this._onChapterTitleChange.bind(this));
    return () => {
      this._chapterTitleEl!.textContent = '';
      this._chapterTitleEl = null;
    };
  }

  protected _onChapterTitleChange() {
    this._chapterTitleEl!.textContent = this._chapterTitle();
  }
}

export interface MediaTimeSliderElement extends HTMLCustomElement<TimeSlider> {}

export interface TimeSliderAPI extends SliderAPI {
  props: TimeSliderProps;
  cssvars: TimeSliderCSSVars;
}

export interface TimeSliderCSSVars extends SliderCSSVars {
  /**
   * The percentage of media playback that has been buffered.
   */
  readonly 'media-buffered-percent': string;
}

export interface TimeSliderProps extends SliderProps {
  // Classes
  chaptersClass: string | null;
  chapterContainerClass: string | null;
  chapterClass: string | null;

  /**
   * Whether it should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  pauseWhileDragging: boolean;
  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   */
  seekingRequestThrottle: number;
}

interface ThrottledSeeking {
  (time: number, event: Event): void;
  cancel(): void;
}
