import { SliderValueTextElement } from '../ui/slider/SliderValueTextElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-slider-value-text', SliderValueTextElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider-value-text': SliderValueTextElement;
  }
}
