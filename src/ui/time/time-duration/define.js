import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  TimeDurationElement,
  VDS_TIME_DURATION_ELEMENT_TAG_NAME
} from './TimeDurationElement.js';

safelyDefineCustomElement(
  VDS_TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement
);
