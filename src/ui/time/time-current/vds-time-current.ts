import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TIME_CURRENT_ELEMENT_TAG_NAME } from './time-current.types';
import { TimeCurrentElement } from './TimeCurrentElement';

export const VDS_TIME_CURRENT_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${TIME_CURRENT_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
  TimeCurrentElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TIME_CURRENT_ELEMENT_TAG_NAME]: TimeCurrentElement;
  }
}
