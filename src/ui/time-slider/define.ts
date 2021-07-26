import { safelyDefineCustomElement } from '@utils/dom';

import {
  TIME_SLIDER_ELEMENT_TAG_NAME,
  TimeSliderElement
} from './TimeSliderElement';

safelyDefineCustomElement(TIME_SLIDER_ELEMENT_TAG_NAME, TimeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_SLIDER_ELEMENT_TAG_NAME]: TimeSliderElement;
  }
}
