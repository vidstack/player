import { MEDIA_UI_ELEMENT_TAG_NAME } from './constants.js';
import { MediaUiElement } from './MediaUiElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
  }
}
