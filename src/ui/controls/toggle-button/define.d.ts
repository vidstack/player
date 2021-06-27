import {
  ToggleButtonElement,
  VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME
} from './ToggleButtonElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME]: ToggleButtonElement;
  }
}
