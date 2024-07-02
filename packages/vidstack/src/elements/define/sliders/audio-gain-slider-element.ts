import { Host } from 'maverick.js/element';

import { AudioGainSlider } from '../../../components/ui/sliders/audio-gain-slider';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/audio-gain-slider}
 * @example
 * ```html
 * <media-audio-gain-slider>
 *   <div class="track"></div>
 *   <div class="track-fill"></div>
 *   <div class="track-progress"></div>
 *   <div class="thumb"></div>
 * </media-audio-gain-slider>
 * ```
 * @example
 * ```html
 * <media-audio-gain-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value></media-slider-value>
 *   </media-slider-preview>
 * </media-audio-gain-slider>
 * ```
 */
export class MediaAudioGainSliderElement extends Host(HTMLElement, AudioGainSlider) {
  static tagName = 'media-audio-gain-slider';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-audio-gain-slider': MediaAudioGainSliderElement;
  }
}
