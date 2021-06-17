import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	TimeDurationElement,
	VDS_TIME_DURATION_ELEMENT_TAG_NAME
} from './TimeDurationElement';

safelyDefineCustomElement(
	VDS_TIME_DURATION_ELEMENT_TAG_NAME,
	TimeDurationElement
);
