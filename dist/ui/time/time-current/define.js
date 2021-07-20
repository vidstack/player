import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
} from './TimeCurrentElement.js';
safelyDefineCustomElement(TIME_CURRENT_ELEMENT_TAG_NAME, TimeCurrentElement);
