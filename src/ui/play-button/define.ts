import { safelyDefineCustomElement } from '@utils/dom';

import {
  PLAY_BUTTON_ELEMENT_TAG_NAME,
  PlayButtonElement
} from './PlayButtonElement';

safelyDefineCustomElement(PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [PLAY_BUTTON_ELEMENT_TAG_NAME]: PlayButtonElement;
  }
}
