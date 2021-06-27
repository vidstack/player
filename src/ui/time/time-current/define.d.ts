import {
  TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
} from './TimeCurrentElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [TIME_CURRENT_ELEMENT_TAG_NAME]: TimeCurrentElement;
  }
}
