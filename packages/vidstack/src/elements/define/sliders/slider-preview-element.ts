import { Host } from 'maverick.js/element';

import { SliderPreview } from '../../../components';

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/slider#preview}
 */
export class MediaSliderPreviewElement extends Host(HTMLElement, SliderPreview) {
  static tagName = 'media-slider-preview';
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-preview': MediaSliderPreviewElement;
  }
}
