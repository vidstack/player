import { SliderVideoElement } from '../ui/slider/SliderVideoElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-slider-video', SliderVideoElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider-video': SliderVideoElement;
  }
}
