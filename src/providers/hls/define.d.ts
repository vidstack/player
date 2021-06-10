import { VDS_HLS_ELEMENT_TAG_NAME } from './constants';
import { HlsElement } from './HlsElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_HLS_ELEMENT_TAG_NAME]: HlsElement;
	}
}
