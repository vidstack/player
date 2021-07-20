import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  TIME_PROGRESS_ELEMENT_TAG_NAME,
  TimeProgressElement
} from './TimeProgressElement.js';
safelyDefineCustomElement(TIME_PROGRESS_ELEMENT_TAG_NAME, TimeProgressElement);
