import {
  TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
} from './TimeCurrentElement';

window.customElements.define(TIME_CURRENT_ELEMENT_TAG_NAME, TimeCurrentElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_CURRENT_ELEMENT_TAG_NAME]: TimeCurrentElement;
  }
}
