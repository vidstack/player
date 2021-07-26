import {
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
} from './TimeDurationElement';

window.customElements.define(
  TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_DURATION_ELEMENT_TAG_NAME]: TimeDurationElement;
  }
}
