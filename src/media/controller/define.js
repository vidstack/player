import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
	MediaControllerElement,
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME
} from './MediaControllerElement.js';

safelyDefineCustomElement(
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
	MediaControllerElement
);
