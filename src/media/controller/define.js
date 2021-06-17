import { safelyDefineCustomElement } from '../../utils/dom';
import {
	MediaControllerElement,
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME
} from './MediaControllerElement';

safelyDefineCustomElement(
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
	MediaControllerElement
);
