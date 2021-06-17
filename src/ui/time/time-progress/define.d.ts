import {
	TimeProgressElement,
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME
} from './TimeProgressElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TIME_PROGRESS_ELEMENT_TAG_NAME]: TimeProgressElement;
	}
}
