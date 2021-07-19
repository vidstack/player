import { safelyDefineCustomElement } from '../../utils/dom.js';
import { TOGGLE_ELEMENT_TAG_NAME, ToggleElement } from './ToggleElement.js';

safelyDefineCustomElement(TOGGLE_ELEMENT_TAG_NAME, ToggleElement);
