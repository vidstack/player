import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  BufferingIndicatorElement,
  VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement.js';

safelyDefineCustomElement(
  VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);
