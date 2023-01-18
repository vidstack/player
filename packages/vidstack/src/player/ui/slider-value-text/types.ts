import type { HTMLCustomElement } from 'maverick.js/element';

export interface SliderValueTextProps {
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
  padHours: boolean;
  /**
   * Round the value when formatted as a percentage to the given number of decimal places. Only
   * available if `format` attribute is `percent`.
   */
  decimalPlaces: number;
}

/**
 * Outputs the current slider value as text.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/slider-value-text}
 * @tagname vds-slider-value-text
 * @example
 * ```html
 * <vds-time-slider>
 *   <vds-slider-value-text
 *     type="pointer"
 *     format="time"
 *     slot="preview"
 *   ></vds-slider-value-text>
 * </vds-time-slider>
 * ```
 * @example
 * ```html
 * <vds-slider-value-text
 *   type="current"
 * ></vds-slider-value-text>
 * ```
 * @example
 * ```html
 * <vds-slider-value-text
 *   format="time"
 *   show-hours
 *   pad-hours
 * ></vds-slider-value-text>
 * ```
 * @example
 * ```html
 * <vds-slider-value-text
 *   format="percent"
 *   decimal-places="2"
 * ></vds-slider-value-text>
 * ```
 */
export interface SliderValueTextElement extends HTMLCustomElement<SliderValueTextProps> {}
