import { VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME } from './constants';
import { MediaContainerElement } from './MediaContainerElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME]: MediaContainerElement;
	}
}
