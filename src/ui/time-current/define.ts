import { safelyDefineCustomElement } from '../../utils/dom';
import {
  TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
} from './TimeCurrentElement';

safelyDefineCustomElement(TIME_CURRENT_ELEMENT_TAG_NAME, TimeCurrentElement);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_CURRENT_ELEMENT_TAG_NAME]: TimeCurrentElement;
  }
}
