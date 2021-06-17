import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	TimeProgressElement,
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME
} from './TimeProgressElement';

safelyDefineCustomElement(
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
	TimeProgressElement
);
