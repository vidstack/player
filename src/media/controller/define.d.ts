import {
	MediaControllerElement,
	VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME
} from './MediaControllerElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
	}
}
