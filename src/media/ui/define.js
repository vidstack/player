import { safelyDefineCustomElement } from '../../utils/dom';
import {
	MediaUiElement,
	VDS_MEDIA_UI_ELEMENT_TAG_NAME
} from './MediaUiElement';

safelyDefineCustomElement(VDS_MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);
