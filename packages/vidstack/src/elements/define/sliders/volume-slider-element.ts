import { Host } from 'maverick.js/element';

import { VolumeSlider } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/volume-slider}
 * @example
 * ```html
 * <media-volume-slider>
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-volume-slider>
 * ```
 * @example
 * ```html
 * <media-volume-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value></media-slider-value>
 *   </media-slider-preview>
 * </media-volume-slider>
 * ```
 */
export class MediaVolumeSliderElement extends Host(HTMLElement, VolumeSlider) {
  static tagName = 'media-volume-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-volume-slider': MediaVolumeSliderElement;
  }
}
