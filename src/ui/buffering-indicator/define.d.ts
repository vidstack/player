import { safelyDefineCustomElement } from '../../utils/dom';
import {
	BufferingIndicatorElement,
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
	}
}
