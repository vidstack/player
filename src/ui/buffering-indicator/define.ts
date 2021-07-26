import { safelyDefineCustomElement } from '@utils/dom';

import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from './BufferingIndicatorElement';

safelyDefineCustomElement(
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);

declare global {
  interface HTMLElementTagNameMap {
    [BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
  }
}
