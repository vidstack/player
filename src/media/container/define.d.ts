import {
	MediaContainerElement,
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME
} from './MediaContainerElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME]: MediaContainerElement;
	}
}
