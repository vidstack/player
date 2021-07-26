import { safelyDefineCustomElement } from '@utils/dom';

import {
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
} from './ToggleButtonElement';

safelyDefineCustomElement(TOGGLE_BUTTON_ELEMENT_TAG_NAME, ToggleButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [TOGGLE_BUTTON_ELEMENT_TAG_NAME]: ToggleButtonElement;
  }
}
