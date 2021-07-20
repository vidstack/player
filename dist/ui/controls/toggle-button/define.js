import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
} from './ToggleButtonElement.js';
safelyDefineCustomElement(TOGGLE_BUTTON_ELEMENT_TAG_NAME, ToggleButtonElement);
