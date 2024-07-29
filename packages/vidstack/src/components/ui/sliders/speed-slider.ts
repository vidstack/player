import throttle from 'just-throttle';
import { Component, effect } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import type { SliderCSSVars } from './slider/api/cssvars';
import type {
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './slider/api/events';
import { sliderState, type SliderState } from './slider/api/state';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly input playback rate control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether setting playback rate is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/speed-slider}
 */
export class SpeedSlider extends Component<
  SpeedSliderProps,
  SpeedSliderState,
  SpeedSliderEvents,
  SpeedSliderCSSVars
> {
  static props: SpeedSliderProps = {
    ...SliderController.props,
    step: 0.25,
    keyStep: 0.25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 2,
  };

  static state = sliderState;

  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();

    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this),
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this),
    }).attach(this);

    effect(this.#watchMinMax.bind(this));
    effect(this.#watchPlaybackRate.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-speed-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Speed');

    const { canSetPlaybackRate } = this.#media.$state;
    this.setAttributes({
      'data-supported': canSetPlaybackRate,
      'aria-hidden': $ariaBool(() => !canSetPlaybackRate()),
    });
  }

  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }

  #getARIAValueText() {
    const { value } = this.$state;
    return value() + 'x';
  }

  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }

  #watchPlaybackRate() {
    const { playbackRate } = this.#media.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch('value-change', { detail: newValue });
  }

  #roundValue(value: number) {
    return round(value, 2);
  }

  #isDisabled() {
    const { disabled } = this.$props,
      { canSetPlaybackRate } = this.#media.$state;
    return disabled() || !canSetPlaybackRate();
  }

  #throttledSpeedChange = throttle(this.#onPlaybackRateChange.bind(this), 25);
  #onPlaybackRateChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const rate = event.detail;
    this.#media.remote.changePlaybackRate(rate, event);
  }

  #onValueChange(event: SliderValueChangeEvent): void {
    this.#throttledSpeedChange(event);
  }

  #onDragValueChange(event: SliderDragValueChangeEvent): void {
    this.#throttledSpeedChange(event);
  }
}

export interface SpeedSliderProps extends SliderControllerProps {
  /**
   * The minimum playback rate.
   */
  min: number;
  /**
   * The maximum playback rate.
   */
  max: number;
}

export interface SpeedSliderState extends SliderState {}

export interface SpeedSliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-rate-change-request'> {}

export interface SpeedSliderCSSVars extends SliderCSSVars {}
