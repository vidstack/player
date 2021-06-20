import {
	BufferingIndicatorElement,
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement.js';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
	}
}
