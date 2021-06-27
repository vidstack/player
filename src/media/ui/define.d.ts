import { VDS_MEDIA_UI_ELEMENT_TAG_NAME } from './constants.js';
import { MediaUiElement } from './MediaUiElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
  }
}
