import { safelyDefineCustomElement } from '../../utils/dom';
import { SliderElement } from './SliderElement';

safelyDefineCustomElement('vds-slider', SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider': SliderElement;
  }
}
