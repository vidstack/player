import throttle from 'just-throttle';
import { Component, computed, effect, peek } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { sortVideoQualities } from '../../../core/quality/utils';
import { $ariaBool } from '../../../utils/aria';
import { setAttributeIfEmpty } from '../../../utils/dom';
import type { SliderCSSVars } from './slider/api/cssvars';
import type {
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './slider/api/events';
import { sliderState, type SliderState } from './slider/api/state';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly input video quality control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether setting video quality is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/quality-slider}
 */
export class QualitySlider extends Component<
  QualitySliderProps,
  QualitySliderState,
  QualitySliderEvents,
  QualitySliderCSSVars
> {
  static props: QualitySliderProps = {
    ...SliderController.props,
    step: 1,
    keyStep: 1,
    shiftKeyMultiplier: 1,
  };

  static state = sliderState;

  #media!: MediaContext;

  #sortedQualities = computed(() => {
    const { qualities } = this.#media.$state;
    return sortVideoQualities(qualities());
  });

  protected override onSetup(): void {
    this.#media = useMediaContext();

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

    effect(this.#watchMax.bind(this));
    effect(this.#watchQuality.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-quality-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Video Quality');

    const { qualities, canSetQuality } = this.#media.$state,
      $supported = computed(() => canSetQuality() && qualities().length > 0);

    this.setAttributes({
      'data-supported': $supported,
      'aria-hidden': $ariaBool(() => !$supported()),
    });
  }

  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }

  #getARIAValueText() {
    const { quality } = this.#media.$state;

    if (!quality()) return '';

    const { height, bitrate } = quality()!,
      bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1000000).toFixed(2)} Mbps` : null;

    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ''}` : 'Auto';
  }

  #watchMax() {
    const $qualities = this.#sortedQualities();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }

  #watchQuality() {
    let { quality } = this.#media.$state,
      $qualities = this.#sortedQualities(),
      value = Math.max(0, $qualities.indexOf(quality()!));
    this.$state.value.set(value);
    this.dispatch('value-change', { detail: value });
  }

  #isDisabled() {
    const { disabled } = this.$props,
      { canSetQuality, qualities } = this.#media.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }

  #throttledQualityChange = throttle(this.#onQualityChange.bind(this), 25);
  #onQualityChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;

    const { qualities } = this.#media,
      quality = peek(this.#sortedQualities)[event.detail];

    this.#media.remote.changeQuality(qualities.indexOf(quality), event);
  }

  #onValueChange(event: SliderValueChangeEvent): void {
    this.#throttledQualityChange(event);
  }

  #onDragValueChange(event: SliderDragValueChangeEvent): void {
    this.#throttledQualityChange(event);
  }
}

export interface QualitySliderProps extends SliderControllerProps {}

export interface QualitySliderState extends SliderState {}

export interface QualitySliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-quality-change-request'> {}

export interface QualitySliderCSSVars extends SliderCSSVars {}
