import {
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
} from './ToggleButtonElement';

window.customElements.define(
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
);

declare global {
  interface HTMLElementTagNameMap {
    [TOGGLE_BUTTON_ELEMENT_TAG_NAME]: ToggleButtonElement;
  }
}
