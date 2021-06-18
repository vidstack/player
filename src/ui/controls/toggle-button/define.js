import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	ToggleButtonElement,
	VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME
} from './ToggleButtonElement';

safelyDefineCustomElement(
	VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
	ToggleButtonElement
);
