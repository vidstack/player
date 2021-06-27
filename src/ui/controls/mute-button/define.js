import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  MuteButtonElement,
  VDS_MUTE_BUTTON_ELEMENT_TAG_NAME
} from './MuteButtonElement.js';

safelyDefineCustomElement(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);
