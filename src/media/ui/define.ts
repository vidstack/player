import { safelyDefineCustomElement } from '@utils/dom';

import { MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement } from './MediaUiElement';

safelyDefineCustomElement(MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
  }
}
