import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from './MuteButtonElement';

window.customElements.define(MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
  }
}
