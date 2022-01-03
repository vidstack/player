import { SliderElement } from '../ui/slider/SliderElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-slider', SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider': SliderElement;
  }
}
