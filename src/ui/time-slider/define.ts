import { safelyDefineCustomElement } from '../../utils/dom';
import { TimeSliderElement } from './TimeSliderElement';

safelyDefineCustomElement('vds-time-slider', TimeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-slider': TimeSliderElement;
  }
}
