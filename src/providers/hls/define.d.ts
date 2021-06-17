import { HlsElement, VDS_HLS_ELEMENT_TAG_NAME } from './HlsElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_HLS_ELEMENT_TAG_NAME]: HlsElement;
	}
}
