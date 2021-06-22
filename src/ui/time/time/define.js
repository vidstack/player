import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { TimeElement, VDS_TIME_ELEMENT_TAG_NAME } from './TimeElement.js';

safelyDefineCustomElement(VDS_TIME_ELEMENT_TAG_NAME, TimeElement);
