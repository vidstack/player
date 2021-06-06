import { VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME } from './media-controller.constants';
import { MediaControllerElement } from './MediaControllerElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
	}
}
