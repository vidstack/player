import {
  PLAY_BUTTON_ELEMENT_TAG_NAME,
  PlayButtonElement
} from './PlayButtonElement';

window.customElements.define(PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [PLAY_BUTTON_ELEMENT_TAG_NAME]: PlayButtonElement;
  }
}
