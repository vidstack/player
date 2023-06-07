import { computed, useContext, useStore, type ReadSignal, type StoreContext } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { round } from '../../../utils/number';
import { formatTime } from '../../../utils/time';
import { SliderStoreFactory } from './slider/api/store';
import type { SliderValueFormat } from './slider/format';
import { sliderValueFormatContext } from './slider/format';

declare global {
  interface MaverickElements {
    'media-slider-value': MediaSliderValueElement;
  }
}

/**
 * Outputs the current slider value as text.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-value}
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
 * @example
 * ```html
 * <media-slider-value
 *   type="current"
 * ></media-slider-value>
 * ```
 * @example
 * ```html
 * <media-slider-value
 *   format="time"
 *   show-hours
 *   pad-hours
 * ></media-slider-value>
 * ```
 * @example
 * ```html
 * <media-slider-value
 *   format="percent"
 *   decimal-places="2"
 * ></media-slider-value>
 * ```
 */
export class SliderValue extends Component<SliderValueAPI> {
  static el = defineElement<SliderValueAPI>({
    tagName: 'media-slider-value',
    props: {
      type: 'current',
      format: undefined,
      showHours: false,
      padHours: false,
      padMinutes: false,
      decimalPlaces: 2,
    },
  });

  protected _format!: SliderValueFormat;
  protected _text!: ReadSignal<string>;
  protected _slider!: StoreContext<typeof SliderStoreFactory>;

  protected override onAttach() {
    this._slider = useStore(SliderStoreFactory);
    this._format = useContext(sliderValueFormatContext);
    this._text = computed(this._getText.bind(this));
  }

  protected _getText() {
    const { type, format, decimalPlaces, padHours, padMinutes, showHours } = this.$props;
    const { value: sliderValue, pointerValue, min, max } = this._slider;

    const value = type() === 'current' ? sliderValue() : pointerValue();

    if (format() === 'percent') {
      const range = max() - min();
      const percent = (value / range) * 100;
      return (this._format.percent ?? round)(percent, decimalPlaces()) + '﹪';
    } else if (format() === 'time') {
      return (this._format.time ?? formatTime)(value, padHours(), padMinutes(), showHours());
    } else {
      return this._format.value?.(value) ?? value.toFixed(2);
    }
  }

  override render() {
    return <span>{this._text()}</span>;
  }
}

export interface MediaSliderValueElement extends HTMLCustomElement<SliderValue> {}

export interface SliderValueAPI {
  props: SliderValueProps;
}

export interface SliderValueProps {
  /**
   * Whether to use the slider's current value, or pointer value.
   */
  type: 'current' | 'pointer';
  /**
   * Determines how the value is formatted.
   */
  format: 'percent' | 'time' | undefined;
  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour. Only available if the `format` attribute is set to `time`.
   *
   * @example `20:30 -> 0:20:35`
   */
  showHours: boolean;
  /**
   * Whether the hours unit should be padded with zeroes to a length of 2. Only available if
   * the `format` attribute is set to `time`.
   *
   * @example `1:20:03 -> 01:20:03`
   */
  padHours: boolean | null;
  /**
   * Whether the minutes unit should be padded with zeroes to a length of 2. Only available if
   * the `format` attribute is set to `time`.
   *
   * @example `5:22 -> 05:22`
   */
  padMinutes: boolean | null;
  /**
   * Round the value when formatted as a percentage to the given number of decimal places. Only
   * available if `format` attribute is `percent`.
   */
  decimalPlaces: number;
}
