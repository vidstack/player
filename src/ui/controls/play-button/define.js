import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	PlayButtonElement,
	VDS_PLAY_BUTTON_ELEMENT_TAG_NAME
} from './PlayButtonElement';

safelyDefineCustomElement(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);
