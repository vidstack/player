import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { ToggleElement, VDS_TOGGLE_ELEMENT_TAG_NAME } from './ToggleElement.js';

safelyDefineCustomElement(VDS_TOGGLE_ELEMENT_TAG_NAME, ToggleElement);
