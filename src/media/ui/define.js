import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
	MediaUiElement,
	VDS_MEDIA_UI_ELEMENT_TAG_NAME
} from './MediaUiElement.js';

safelyDefineCustomElement(VDS_MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);
