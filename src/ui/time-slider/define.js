import { safelyDefineCustomElement } from '@utils/dom.js';
import {
  TIME_SLIDER_ELEMENT_TAG_NAME,
  TimeSliderElement
} from './TimeSliderElement.js';

safelyDefineCustomElement(TIME_SLIDER_ELEMENT_TAG_NAME, TimeSliderElement);
