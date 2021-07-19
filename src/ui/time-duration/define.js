import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
} from './TimeDurationElement.js';

safelyDefineCustomElement(TIME_DURATION_ELEMENT_TAG_NAME, TimeDurationElement);
