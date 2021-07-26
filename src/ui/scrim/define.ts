import { SCRIM_ELEMENT_TAG_NAME, ScrimElement } from './ScrimElement';

window.customElements.define(SCRIM_ELEMENT_TAG_NAME, ScrimElement);

declare global {
  interface HTMLElementTagNameMap {
    [SCRIM_ELEMENT_TAG_NAME]: ScrimElement;
  }
}
