import { safelyDefineCustomElement } from '../../utils/dom';
import { TOGGLE_ELEMENT_TAG_NAME, ToggleElement } from './ToggleElement';

safelyDefineCustomElement(TOGGLE_ELEMENT_TAG_NAME, ToggleElement);

declare global {
  interface HTMLElementTagNameMap {
    [TOGGLE_ELEMENT_TAG_NAME]: ToggleElement;
  }
}
