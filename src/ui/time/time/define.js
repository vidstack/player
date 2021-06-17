import { safelyDefineCustomElement } from '../../../utils/dom';
import { TimeElement, VDS_TIME_ELEMENT_TAG_NAME } from './TimeElement';

safelyDefineCustomElement(VDS_TIME_ELEMENT_TAG_NAME, TimeElement);
