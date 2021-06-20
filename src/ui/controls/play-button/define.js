import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
	PlayButtonElement,
	VDS_PLAY_BUTTON_ELEMENT_TAG_NAME
} from './PlayButtonElement.js';

safelyDefineCustomElement(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);
