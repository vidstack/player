import { MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement } from './MediaUiElement';

window.customElements.define(MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
  }
}
