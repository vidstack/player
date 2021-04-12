import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from './buffering-indicator.types';
import { BufferingIndicatorElement } from './BufferingIndicatorElement';

export const VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${BUFFERING_INDICATOR_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
  }
}
