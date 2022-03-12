import { safelyDefineCustomElement } from '@vidstack/foundation';

import { SliderVideoElement } from '../ui/slider/SliderVideoElement.js';

safelyDefineCustomElement('vds-slider-video', SliderVideoElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider-video': SliderVideoElement;
  }
}
