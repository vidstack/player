import { TIME_ELEMENT_TAG_NAME, TimeElement } from './TimeElement';

window.customElements.define(TIME_ELEMENT_TAG_NAME, TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_ELEMENT_TAG_NAME]: TimeElement;
  }
}
