import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	TimeCurrentElement,
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME
} from './TimeCurrentElement';

safelyDefineCustomElement(
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
	TimeCurrentElement
);
