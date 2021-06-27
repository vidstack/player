import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from './BufferingIndicatorElement.js';

safelyDefineCustomElement(
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);
