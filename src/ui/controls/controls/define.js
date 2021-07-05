import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  CONTROLS_ELEMENT_TAG_NAME,
  ControlsElement
} from './ControlsElement.js';

safelyDefineCustomElement(CONTROLS_ELEMENT_TAG_NAME, ControlsElement);
