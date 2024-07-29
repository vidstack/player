import throttle from 'just-throttle';
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
 * Versatile and user-friendly input volume control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the volume level within the range 0 (muted) to 100.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether volume control is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/volume-slider}
 */
export class VolumeSlider extends Component<
  VolumeSliderProps,
  VolumeSliderState,
  VolumeSliderEvents,
  VolumeSliderCSSVars
> {
  static props: VolumeSliderProps = {
    ...SliderController.props,
    keyStep: 5,
    shiftKeyMultiplier: 2,
  };

  static state = sliderState;

  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();

    const { audioGain } = this.#media.$state;
    provideContext(sliderValueFormatContext, {
      default: 'percent',
      value(value) {
        return (value * (audioGain() ?? 1)).toFixed(2);
      },
      percent(value) {
        return Math.round(value * (audioGain() ?? 1));
      },
    });

    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueMax: this.#getARIAValueMax.bind(this),
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this),
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this),
    }).attach(this);

    effect(this.#watchVolume.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-volume-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Volume');

    const { canSetVolume } = this.#media.$state;
    this.setAttributes({
      'data-supported': canSetVolume,
      'aria-hidden': $ariaBool(() => !canSetVolume()),
    });
  }

  #getARIAValueNow() {
    const { value } = this.$state,
      { audioGain } = this.#media.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }

  #getARIAValueText() {
    const { value, max } = this.$state,
      { audioGain } = this.#media.$state;
    return round((value() / max()) * (audioGain() ?? 1) * 100, 2) + '%';
  }

  #getARIAValueMax() {
    const { audioGain } = this.#media.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }

  #isDisabled() {
    const { disabled } = this.$props,
      { canSetVolume } = this.#media.$state;
    return disabled() || !canSetVolume();
  }

  #watchVolume() {
    const { muted, volume } = this.#media.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch('value-change', { detail: newValue });
  }

  #throttleVolumeChange = throttle(this.#onVolumeChange.bind(this), 25);
  #onVolumeChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this.#media.remote.changeVolume(mediaVolume, event);
  }

  #onValueChange(event: SliderValueChangeEvent): void {
    this.#throttleVolumeChange(event);
  }

  #onDragValueChange(event: SliderDragValueChangeEvent): void {
    this.#throttleVolumeChange(event);
  }
}

export interface VolumeSliderProps extends SliderControllerProps {}

export interface VolumeSliderState extends SliderState {}

export interface VolumeSliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-volume-change-request'> {}

export interface VolumeSliderCSSVars extends SliderCSSVars {}
