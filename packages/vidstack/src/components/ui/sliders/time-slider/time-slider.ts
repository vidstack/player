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

  #media!: MediaContext;
  #dispatchSeeking!: ThrottledSeeking;
  #chapter = signal<TextTrack | null>(null);

  constructor() {
    super();

    const { noSwipeGesture } = this.$props;
    new SliderController({
      swipeGesture: () => !noSwipeGesture(),
      getValue: this.#getValue.bind(this),
      getStep: this.#getStep.bind(this),
      getKeyStep: this.#getKeyStep.bind(this),
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this),
      },
      onDragStart: this.#onDragStart.bind(this),
      onDragValueChange: this.#onDragValueChange.bind(this),
      onDragEnd: this.#onDragEnd.bind(this),
      onValueChange: this.#onValueChange.bind(this),
    });
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();

    provideContext(sliderValueFormatContext, {
      default: 'time',
      value: this.#formatValue.bind(this),
      time: this.#formatTime.bind(this),
    });

    this.setAttributes({
      'data-chapters': this.#hasChapters.bind(this),
    });

    this.setStyles({
      '--slider-progress': this.#calcBufferedPercent.bind(this),
    });

    effect(this.#watchCurrentTime.bind(this));
    effect(this.#watchSeekingThrottle.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-time-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Seek');
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#watchPreviewing.bind(this));
    watchActiveTextTrack(this.#media.textTracks, 'chapters', this.#chapter.set);
  }

  #calcBufferedPercent() {
    const { bufferedEnd, duration } = this.#media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + '%';
  }

  #hasChapters() {
    const { duration } = this.#media.$state;
    return this.#chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }

  #watchSeekingThrottle() {
    this.#dispatchSeeking = throttle(
      this.#seeking.bind(this),
      this.$props.seekingRequestThrottle(),
    );
  }

  #watchCurrentTime() {
    if (this.$state.hidden()) return;

    const { value, dragging } = this.$state,
      newValue = this.#getValue();

    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch('value-change', { detail: newValue });
    }
  }

  #watchPreviewing() {
    const player = this.#media.player.el,
      { preview } = useContext(sliderContext);
    player && preview() && setAttribute(player, 'data-preview', this.$state.active());
  }

  #seeking(time: number, event: Event) {
    this.#media.remote.seeking(time, event);
  }

  #seek(time: number, percent: number, event: Event) {
    this.#dispatchSeeking.cancel();

    const { live } = this.#media.$state;
    if (live() && percent >= 99) {
      this.#media.remote.seekToLiveEdge(event);
      return;
    }

    this.#media.remote.seek(time, event);
  }

  #playingBeforeDragStart = false;
  #onDragStart(event: SliderDragStartEvent) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this.#media.$state;
      this.#playingBeforeDragStart = !paused();
      this.#media.remote.pause(event);
    }
  }

  #onDragValueChange(event: SliderDragValueChangeEvent) {
    this.#dispatchSeeking(this.#percentToTime(event.detail), event);
  }

  #onDragEnd(event: SliderValueChangeEvent | SliderDragEndEvent) {
    // Ensure a seeking event is always fired before a seeked event for consistency.
    const { seeking } = this.#media.$state;
    if (!peek(seeking)) this.#seeking(this.#percentToTime(event.detail), event);

    const percent = event.detail;
    this.#seek(this.#percentToTime(percent), percent, event);

    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this.#playingBeforeDragStart) {
      this.#media.remote.play(event);
      this.#playingBeforeDragStart = false;
    }
  }

  #onValueChange(event: SliderValueChangeEvent) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this.#onDragEnd(event);
  }

  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------

  #getValue() {
    const { currentTime } = this.#media.$state;
    return this.#timeToPercent(currentTime());
  }

  #getStep() {
    const value = (this.$props.step() / this.#media.$state.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  #getKeyStep() {
    const value = (this.$props.keyStep() / this.#media.$state.duration()) * 100;
    return Number.isFinite(value) ? value : 1;
  }

  #roundValue(value: number) {
    return round(value, 3);
  }

  #isDisabled() {
    const { disabled } = this.$props,
      { canSeek } = this.#media.$state;
    return disabled() || !canSeek();
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }

  #getARIAValueText(): string {
    const time = this.#percentToTime(this.$state.value()),
      { duration } = this.#media.$state;
    return Number.isFinite(time)
      ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}`
      : 'live';
  }

  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------

  #percentToTime(percent: number) {
    const { duration } = this.#media.$state;
    return round((percent / 100) * duration(), 5);
  }

  #timeToPercent(time: number) {
    const { liveEdge, duration } = this.#media.$state,
      rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }

  #formatValue(percent: number) {
    const time = this.#percentToTime(percent),
      { live, duration } = this.#media.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : 'LIVE';
  }

  #formatTime(percent: number, options?: FormatTimeOptions) {
    const time = this.#percentToTime(percent),
      { live, duration } = this.#media.$state,
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
