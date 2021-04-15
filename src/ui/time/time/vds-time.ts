import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TIME_ELEMENT_TAG_NAME } from './time.types';
import { TimeElement } from './TimeElement';

export const VDS_TIME_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${TIME_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_TIME_ELEMENT_TAG_NAME, TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TIME_ELEMENT_TAG_NAME]: TimeElement;
  }
}
