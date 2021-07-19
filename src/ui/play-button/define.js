import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  PLAY_BUTTON_ELEMENT_TAG_NAME,
  PlayButtonElement
} from './PlayButtonElement.js';

safelyDefineCustomElement(PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);
