import { safelyDefineCustomElement } from '@utils/dom';

import { TIME_ELEMENT_TAG_NAME, TimeElement } from './TimeElement';

safelyDefineCustomElement(TIME_ELEMENT_TAG_NAME, TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_ELEMENT_TAG_NAME]: TimeElement;
  }
}
