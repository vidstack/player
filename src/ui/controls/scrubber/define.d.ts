import {
	ScrubberElement,
	VDS_SCRUBBER_ELEMENT_TAG_NAME
} from './ScrubberElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_SCRUBBER_ELEMENT_TAG_NAME]: ScrubberElement;
	}
}
