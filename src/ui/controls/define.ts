import { CONTROLS_ELEMENT_TAG_NAME, ControlsElement } from './ControlsElement';

window.customElements.define(CONTROLS_ELEMENT_TAG_NAME, ControlsElement);

declare global {
  interface HTMLElementTagNameMap {
    [CONTROLS_ELEMENT_TAG_NAME]: ControlsElement;
  }
}
