import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { SliderValue } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-value}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-preview>
 *     <media-slider-value type="pointer" format="time"></media-slider-value>
 *   </media-slider-preview>
 * </media-time-slider>
 * ```
 * @example
 * ```html
 * <media-slider-value type="current"></media-slider-value>
 * ```
 * @example
 * ```html
 * <media-slider-value format="time" show-hours pad-hours></media-slider-value>
 * ```
 * @example
 * ```html
 * <media-slider-value format="percent" decimal-places="2"></media-slider-value>
 * ```
 */
export class MediaSliderValueElement extends Host(HTMLElement, SliderValue) {
  static tagName = 'media-slider-value';

  protected onConnect() {
    effect(() => {
      this.textContent = this.getValueText();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-value': MediaSliderValueElement;
  }
}
