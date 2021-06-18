import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	MuteButtonElement,
	VDS_MUTE_BUTTON_ELEMENT_TAG_NAME
} from './MuteButtonElement';

safelyDefineCustomElement(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);
