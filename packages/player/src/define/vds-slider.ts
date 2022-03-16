import { safelyDefineCustomElement } from '@vidstack/foundation';

import { SliderElement } from '../ui/slider/SliderElement';

safelyDefineCustomElement('vds-slider', SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider': SliderElement;
  }
}
