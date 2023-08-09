import { Host } from 'maverick.js/element';
import { TimeSlider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/time-slider}
 * @example
 * ```html
 * <media-time-slider>
 *   <div class="slider-track"></div>
 *   <div class="slider-track-fill"></div>
 *   <div class="slider-track-progress"></div>
 *   <div class="slider-thumb"></div>
 * </media-time-slider>
 * ```
 * @example
 * ```html
 * <media-time-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value type="pointer" format="time"></media-slider-value>
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
