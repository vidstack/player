import {
  TIME_SLIDER_ELEMENT_TAG_NAME,
  TimeSliderElement
} from './TimeSliderElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [TIME_SLIDER_ELEMENT_TAG_NAME]: TimeSliderElement;
  }
}
