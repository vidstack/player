import {
  PlayButtonElement,
  VDS_PLAY_BUTTON_ELEMENT_TAG_NAME
} from './PlayButtonElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_PLAY_BUTTON_ELEMENT_TAG_NAME]: PlayButtonElement;
  }
}
