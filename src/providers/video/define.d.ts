import { VDS_VIDEO_ELEMENT_TAG_NAME } from './constants';
import { VideoElement } from './VideoElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_VIDEO_ELEMENT_TAG_NAME]: VideoElement;
	}
}
