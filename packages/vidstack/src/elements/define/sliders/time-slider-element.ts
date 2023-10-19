import { Host } from 'maverick.js/element';

import { TimeSlider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/time-slider}
 * @example
 * ```html
 * <media-time-slider>
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-time-slider>
 * ```
 * @example
 * ```html
 * <media-time-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value></media-slider-value>
 *   <media-slider-preview>
 * </media-time-slider>
 * ```
 */
export class MediaTimeSliderElement extends Host(HTMLElement, TimeSlider) {
  static tagName = 'media-time-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-time-slider': MediaTimeSliderElement;
  }
}
