import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
	ScrubberElement,
	VDS_SCRUBBER_ELEMENT_TAG_NAME
} from './ScrubberElement.js';

safelyDefineCustomElement(VDS_SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);
