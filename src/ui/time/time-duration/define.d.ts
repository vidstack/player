import {
	TimeDurationElement,
	VDS_TIME_DURATION_ELEMENT_TAG_NAME
} from './TimeDurationElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TIME_DURATION_ELEMENT_TAG_NAME]: TimeDurationElement;
	}
}
