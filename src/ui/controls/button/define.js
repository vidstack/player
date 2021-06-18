import { safelyDefineCustomElement } from '../../../utils/dom';
import { ButtonElement, VDS_BUTTON_ELEMENT_TAG_NAME } from './ButtonElement';

safelyDefineCustomElement(VDS_BUTTON_ELEMENT_TAG_NAME, ButtonElement);
