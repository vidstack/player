import { Host } from 'maverick.js/element';

import { QualitySlider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/quality-slider}
 * @example
 * ```html
 * <media-quality-slider>
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-quality-slider>
 * ```
 * @example
 * ```html
 * <media-quality-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value></media-slider-value>
 *   </media-slider-preview>
 * </media-quality-slider>
 * ```
 */
export class MediaQualitySliderElement extends Host(HTMLElement, QualitySlider) {
  static tagName = 'media-quality-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-quality-slider': MediaQualitySliderElement;
  }
}
