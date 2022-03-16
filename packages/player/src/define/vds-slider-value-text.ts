import { safelyDefineCustomElement } from '@vidstack/foundation';

import { SliderValueTextElement } from '../ui/slider/SliderValueTextElement';

safelyDefineCustomElement('vds-slider-value-text', SliderValueTextElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider-value-text': SliderValueTextElement;
  }
}
