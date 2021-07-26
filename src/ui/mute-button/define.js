import { safelyDefineCustomElement } from '@utils/dom.js';
import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from './MuteButtonElement.js';

safelyDefineCustomElement(MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);
