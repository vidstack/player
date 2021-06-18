import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	FullscreenButtonElement,
	VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME
} from './FullscreenButtonElement';

safelyDefineCustomElement(
	VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
	FullscreenButtonElement
);
