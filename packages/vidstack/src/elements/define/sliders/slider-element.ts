import { Host } from 'maverick.js/element';

import { Slider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/slider}
 * @example
 * ```html
 * <media-slider min="0" max="100" value="50" aria-label="...">
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-slider>
 * ```
 */
export class MediaSliderElement extends Host(HTMLElement, Slider) {
  static tagName = 'media-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider': MediaSliderElement;
  }
}
