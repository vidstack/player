import { safelyDefineCustomElement } from '../../../utils/dom';
import { VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME } from './media-controller.constants';
import { MediaControllerElement } from './MediaControllerElement';

safelyDefineCustomElement(
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
	MediaControllerElement
);
