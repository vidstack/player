import { Host } from 'maverick.js/element';

import { SpeedSlider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/speed-slider}
 * @example
 * ```html
 * <media-speed-slider>
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-speed-slider>
 * ```
 * @example
 * ```html
 * <media-speed-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value></media-slider-value>
 *   </media-slider-preview>
 * </media-speed-slider>
 * ```
 */
export class MediaSpeedSliderElement extends Host(HTMLElement, SpeedSlider) {
  static tagName = 'media-speed-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-speed-slider': MediaSpeedSliderElement;
  }
}
