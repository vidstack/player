import { safelyDefineCustomElement } from '../../utils/dom';
import { BufferingIndicatorElement } from './BufferingIndicatorElement';
import { VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from './constants';

safelyDefineCustomElement(
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
	BufferingIndicatorElement
);
