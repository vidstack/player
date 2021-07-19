import { safelyDefineCustomElement } from '../../utils/dom.js';
import { BUTTON_ELEMENT_TAG_NAME, ButtonElement } from './ButtonElement.js';

safelyDefineCustomElement(BUTTON_ELEMENT_TAG_NAME, ButtonElement);
