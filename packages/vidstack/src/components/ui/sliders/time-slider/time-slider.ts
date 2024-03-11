import throttle from 'just-throttle';
import { Component, effect, peek, provideContext, signal, useContext } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../../core/api/media-request-events';
import type { TextTrack } from '../../../../core/tracks/text/text-track';
import { watchActiveTextTrack } from '../../../../core/tracks/text/utils';
import { setAttributeIfEmpty } from '../../../../utils/dom';
import { round } from '../../../../utils/number';
import { formatSpokenTime, formatTime, type FormatTimeOptions } from '../../../../utils/time';
import type { SliderCSSVars } from '../slider/api/cssvars';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from '../slider/api/events';
import { sliderState, type SliderState } from '../slider/api/state';
import { sliderValueFormatContext } from '../slider/format';
import { sliderContext } from '../slider/slider-context';
import { SliderController, type SliderControllerProps } from '../slider/slider-controller';

/**
 * Versatile and user-friendly input time control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the current playback time within the range 0 to seekable end.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/time-slider}
 */
export class TimeSlider extends Component<
  TimeSliderProps,
  TimeSliderState,
  TimeSliderEvents,
  TimeSliderCSSVars
> {
  static props: TimeSliderProps = {
    ...SliderController.props,
    step: 0.1,
    keyStep: 5,
    shiftKeyMultiplier: 2,
    pauseWhileDragging: false,
    noSwipeGesture: false,
    seekingRequestThrottle: 100,
  };

  static state = sliderState;

  private _media!: MediaContext;
  private _dispatchSeeking!: ThrottledSeeking;
  private _chapter = signal<TextTrack | null>(null);

  constructor() {
    super();

    const { noSwipeGesture } = this.$props;
    new SliderController({
      _swipeGesture: () => !noSwipeGesture(),
      _getStep: this._getStep.bind(this),
      _getKeyStep: this._getKeyStep.bind(this),
      _roundValue: this._roundValue,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragStart: this._onDragStart.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onDragEnd: this._onDragEnd.bind(this),
      _onValueChange: this._onValueChange.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    provideContext(sliderValueFormatContext, {
      default: 'time',
      value: this._formatValue.bind(this),
      time: this._formatTime.bind(this),
    });

    this.setAttributes({
      'data-chapters': this._hasChapters.bind(this),
    });

    this.setStyles({
      '--slider-progress': this._calcBufferedPercent.bind(this),
    });

    effect(this._watchCurrentTime.bind(this));
    effect(this._watchSeekingThrottle.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-time-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Seek');
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchPreviewing.bind(this));
    watchActiveTextTrack(this._media.textTracks, 'chapters', this._chapter.set);
  }

  private _calcBufferedPercent() {
    const { bufferedEnd, duration } = this._media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + '%';
  }

  private _hasChapters() {
    const { duration } = this._media.$state;
    return this._chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }

  private _watchSeekingThrottle() {
    this._dispatchSeeking = throttle(
      this._seeking.bind(this),
      this.$props.seekingRequestThrottle(),
    );
  }

  private _watchCurrentTime() {
    if (this.$state.hidden()) return;

    const { currentTime } = this._media.$state,
      { value, dragging } = this.$state,
      newValue = this._timeToPercent(currentTime());

    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch('value-change', { detail: newValue });
    }
  }

  private _watchPreviewing() {
    const player = this._media.player.el,
      { _preview } = useContext(sliderContext);
    player && _preview() && setAttribute(player, 'data-preview', this.$state.active());
  }

  private _seeking(time: number, event: Event) {
    this._media.remote.seeking(time, event);
  }

  private _seek(time: number, percent: number, event: Event) {
    this._dispatchSeeking.cancel();

    const { live } = this._media.$state;
    if (live() && percent >= 99) {
      this._media.remote.seekToLiveEdge(event);
      return;
    }

    this._media.remote.seek(time, event);
  }

  private _playingBeforeDragStart = false;
  private _onDragStart(event: SliderDragStartEvent) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this._media.$state;
      this._playingBeforeDragStart = !paused();
      this._media.remote.pause(event);
    }
  }

  private _onDragValueChange(event: SliderDragValueChangeEvent) {
    this._dispatchSeeking(this._percentToTime(event.detail), event);
  }

  private _onDragEnd(event: SliderValueChangeEvent | SliderDragEndEvent) {
    // Ensure a seeking event is always fired before a seeked event for consistency.
    const { seeking } = this._media.$state;
    if (!peek(seeking)) this._seeking(this._percentToTime(event.detail), event);

    const percent = event.detail;
    this._seek(this._percentToTime(percent), percent, event);

    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this._playingBeforeDragStart) {
      this._media.remote.play(event);
      this._playingBeforeDragStart = false;
    }
  }

  private _onValueChange(event: SliderValueChangeEvent) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this._onDragEnd(event);
  }

  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------

  private _getStep() {
    const value = (this.$props.step() / this._media.$state.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  private _getKeyStep() {
    const value = (this.$props.keyStep() / this._media.$state.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  private _roundValue(value: number) {
    return round(value, 3);
  }

  private _isDisabled() {
    const { disabled } = this.$props,
      { canSeek } = this._media.$state;
    return disabled() || !canSeek();
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  private _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }

  private _getARIAValueText(): string {
    const time = this._percentToTime(this.$state.value()),
      { duration } = this._media.$state;
    return Number.isFinite(time)
      ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}`
      : 'live';
  }

  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------

  private _percentToTime(percent: number) {
    const { duration } = this._media.$state;
    return round((percent / 100) * duration(), 5);
  }

  private _timeToPercent(time: number) {
    const { liveEdge, duration } = this._media.$state,
      rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }

  private _formatValue(percent: number) {
    const time = this._percentToTime(percent),
      { live, duration } = this._media.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : 'LIVE';
  }

  private _formatTime(percent: number, options?: FormatTimeOptions) {
    const time = this._percentToTime(percent),
      { live, duration } = this._media.$state,
      value = live() ? time - duration() : time;

    return Number.isFinite(time)
      ? `${value < 0 ? '-' : ''}${formatTime(Math.abs(value), options)}`
      : 'LIVE';
  }
}

export interface TimeSliderCSSVars extends SliderCSSVars {
  /**
   * The percentage of media playback that has been buffered.
   */
  readonly 'slider-progress': string;
}

export interface TimeSliderProps extends SliderControllerProps {
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
  /**
   * Whether touch swiping left or right on the player canvas should activate the time slider. This
   * gesture makes it easier for touch users to drag anywhere on the player left or right to
   * seek backwards or forwards, without directly interacting with time slider.
   */
  noSwipeGesture: boolean;
}

interface ThrottledSeeking {
  (time: number, event: Event): void;
  cancel(): void;
}

export interface TimeSliderState extends SliderState {}

export interface TimeSliderEvents
  extends SliderEvents,
    Pick<
      MediaRequestEvents,
      | 'media-play-request'
      | 'media-pause-request'
      | 'media-seeking-request'
      | 'media-seek-request'
      | 'media-live-edge-request'
    > {}
