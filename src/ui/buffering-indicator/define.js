import { safelyDefineCustomElement } from '../../utils/dom';
import {
	BufferingIndicatorElement,
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement';

safelyDefineCustomElement(
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
	BufferingIndicatorElement
);
