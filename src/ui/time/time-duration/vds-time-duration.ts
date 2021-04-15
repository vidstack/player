import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TIME_DURATION_ELEMENT_TAG_NAME } from './time-duration.types';
import { TimeDurationElement } from './TimeDurationElement';

export const VDS_TIME_DURATION_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${TIME_DURATION_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_TIME_DURATION_ELEMENT_TAG_NAME,
  TimeDurationElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TIME_DURATION_ELEMENT_TAG_NAME]: TimeDurationElement;
  }
}
