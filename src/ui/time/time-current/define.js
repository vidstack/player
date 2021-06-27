import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  TimeCurrentElement,
  VDS_TIME_CURRENT_ELEMENT_TAG_NAME
} from './TimeCurrentElement.js';

safelyDefineCustomElement(
  VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement
);
