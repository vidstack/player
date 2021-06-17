import { TimeElement, VDS_TIME_ELEMENT_TAG_NAME } from './TimeElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TIME_ELEMENT_TAG_NAME]: TimeElement;
	}
}
