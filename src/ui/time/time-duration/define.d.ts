import {
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
} from './TimeDurationElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [TIME_DURATION_ELEMENT_TAG_NAME]: TimeDurationElement;
  }
}
