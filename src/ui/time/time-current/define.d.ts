import {
	TimeCurrentElement,
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME
} from './TimeCurrentElement.js';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TIME_CURRENT_ELEMENT_TAG_NAME]: TimeCurrentElement;
	}
}
