import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  ToggleButtonElement,
  VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME
} from './ToggleButtonElement.js';

safelyDefineCustomElement(
  VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement
);
