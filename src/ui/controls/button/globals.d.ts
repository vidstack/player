import { BUTTON_ELEMENT_TAG_NAME, ButtonElement } from './ButtonElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [BUTTON_ELEMENT_TAG_NAME]: ButtonElement;
  }
}
