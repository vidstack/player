import { MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement } from './MediaUiElement.js';
declare global {
    interface HTMLElementTagNameMap {
        [MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
    }
}
