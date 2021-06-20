import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { ButtonElement, VDS_BUTTON_ELEMENT_TAG_NAME } from './ButtonElement.js';

safelyDefineCustomElement(VDS_BUTTON_ELEMENT_TAG_NAME, ButtonElement);
