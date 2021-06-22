import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
	TimeProgressElement,
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME
} from './TimeProgressElement.js';

safelyDefineCustomElement(
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
	TimeProgressElement
);
