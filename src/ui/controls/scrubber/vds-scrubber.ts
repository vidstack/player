import { safelyDefineCustomElement } from '../../../utils/dom';
import { SCRUBBER_ELEMENT_TAG_NAME } from './scrubber.types';
import { ScrubberElement } from './ScrubberElement';

export const VDS_SCRUBBER_ELEMENT_TAG_NAME = 'vds-scrubber';

safelyDefineCustomElement(VDS_SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_SCRUBBER_ELEMENT_TAG_NAME]: ScrubberElement;
	}
}
