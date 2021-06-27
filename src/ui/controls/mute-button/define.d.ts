import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from './MuteButtonElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
  }
}
