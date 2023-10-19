import {
  Component,
  computed,
  method,
  useContext,
  useState,
  type ReadSignal,
  type StateContext,
} from 'maverick.js';

import { round } from '../../../utils/number';
import { formatTime } from '../../../utils/time';
import { Slider } from '../sliders/slider/slider';
import type { SliderValueFormat } from './slider/format';
import { sliderValueFormatContext } from './slider/format';

/**
 * Displays the specific numeric representation of the current or pointer value of the slider.
 * When a user interacts with a slider by moving its thumb along the track, the slider value
 * changes accordingly.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-value}
 */
export class SliderValue extends Component<SliderValueProps> {
  static props: SliderValueProps = {
    type: 'pointer',
    format: null,
    showHours: false,
    padHours: null,
    padMinutes: null,
    decimalPlaces: 2,
  };

  protected _format!: SliderValueFormat;
  protected _text!: ReadSignal<string>;
  protected _slider!: StateContext<typeof Slider.state>;

  protected override onSetup(): void {
    this._slider = useState(Slider.state);
    this._format = useContext(sliderValueFormatContext);
    this._text = computed(this.getValueText.bind(this));
  }

  /**
   * Returns the current value formatted as text based on prop settings.
   */
  @method
  getValueText() {
    const { type, format, decimalPlaces, padHours, padMinutes, showHours } = this.$props,
      { value: sliderValue, pointerValue, min, max } = this._slider,
      _format = format() ?? this._format.default;

    const value = type() === 'current' ? sliderValue() : pointerValue();

    if (_format === 'percent') {
      const range = max() - min();
      const percent = (value / range) * 100;
      return (this._format.percent ?? round)(percent, decimalPlaces()) + '﹪';
    } else if (_format === 'time') {
      return (this._format.time ?? formatTime)(value, padHours(), padMinutes(), showHours());
    } else {
      return this._format.value?.(value) ?? value.toFixed(2);
    }
  }
}

export interface SliderValueProps {
  /**
   * Whether to use the slider's current value, or pointer value.
   */
  type: 'current' | 'pointer';
  /**
   * Determines how the value is formatted. By default it will use the most appropriate formatting,
   * for the time slider that's time, and for volume percent.
   */
  format: 'value' | 'percent' | 'time' | null;
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
   * Whether the minutes unit should be padded with zeroes to a length of 2. Setting this to `null`
   * will pad minutes when hours is >=1. Only available if the `format` attribute is set to `time`.
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
