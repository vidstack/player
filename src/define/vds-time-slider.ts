import { TimeSliderElement } from '../ui/time-slider/TimeSliderElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-time-slider', TimeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-slider': TimeSliderElement;
  }
}
