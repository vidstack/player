import { safelyDefineCustomElement } from '../../utils/dom';
import { BUTTON_ELEMENT_TAG_NAME, ButtonElement } from './ButtonElement';

safelyDefineCustomElement(BUTTON_ELEMENT_TAG_NAME, ButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [BUTTON_ELEMENT_TAG_NAME]: ButtonElement;
  }
}
