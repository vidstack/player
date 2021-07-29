import { safelyDefineCustomElement } from '../../utils/dom';
import {
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
} from './TimeDurationElement';

safelyDefineCustomElement(TIME_DURATION_ELEMENT_TAG_NAME, TimeDurationElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_DURATION_ELEMENT_TAG_NAME]: TimeDurationElement;
  }
}
