import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	ScrubberElement,
	VDS_SCRUBBER_ELEMENT_TAG_NAME
} from './ScrubberElement';

safelyDefineCustomElement(VDS_SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);
