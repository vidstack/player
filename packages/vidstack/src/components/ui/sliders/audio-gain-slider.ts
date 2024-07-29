import { Component, effect, provideContext } from 'maverick.js';

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
import { sliderValueFormatContext } from './slider/format';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly audio boost control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the audio gain within the range 0 to 100.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether audio gain is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/audio-gain-slider}
 */
export class AudioGainSlider extends Component<
  AudioGainSliderProps,
  AudioGainSliderState,
  AudioGainSliderEvents,
  AudioGainSliderCSSVars
> {
  static props: AudioGainSliderProps = {
    ...SliderController.props,
    step: 25,
    keyStep: 25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 300,
  };

  static state = sliderState;

  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();

    provideContext(sliderValueFormatContext, {
      default: 'percent',
      percent: (_, decimalPlaces) => {
        return round(this.$state.value(), decimalPlaces) + '%';
      },
    });

    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this),
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this),
    }).attach(this);

    effect(this.#watchMinMax.bind(this));
    effect(this.#watchAudioGain.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-audio-gain-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Audio Boost');

    const { canSetAudioGain } = this.#media.$state;
    this.setAttributes({
      'data-supported': canSetAudioGain,
      'aria-hidden': $ariaBool(() => !canSetAudioGain()),
    });
  }

  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }

  #getARIAValueText() {
    const { value } = this.$state;
    return value() + '%';
  }

  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }

  #watchAudioGain() {
    const { audioGain } = this.#media.$state,
      value = ((audioGain() ?? 1) - 1) * 100;
    this.$state.value.set(value);
    this.dispatch('value-change', { detail: value });
  }

  #isDisabled() {
    const { disabled } = this.$props,
      { canSetAudioGain } = this.#media.$state;
    return disabled() || !canSetAudioGain();
  }

  #onAudioGainChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const gain = round(1 + event.detail / 100, 2);
    this.#media.remote.changeAudioGain(gain, event);
  }

  #onValueChange(event: SliderValueChangeEvent): void {
    this.#onAudioGainChange(event);
  }

  #onDragValueChange(event: SliderDragValueChangeEvent): void {
    this.#onAudioGainChange(event);
  }
}

export interface AudioGainSliderProps extends SliderControllerProps {
  /**
   * The minimum audio gain boost represented as a percentage.
   */
  min: number;
  /**
   * The minimum audio gain boost represented as a percentage.
   */
  max: number;
}

export interface AudioGainSliderState extends SliderState {}

export interface AudioGainSliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-audio-gain-change-request'> {}

export interface AudioGainSliderCSSVars extends SliderCSSVars {}
