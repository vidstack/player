import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from './BufferingIndicatorElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
  }
}
