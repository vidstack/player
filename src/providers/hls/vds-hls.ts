import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { HLS_ELEMENT_TAG_NAME } from './hls.types';
import { HlsElement } from './HlsElement';

export const VDS_HLS_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${HLS_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_HLS_ELEMENT_TAG_NAME, HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_HLS_ELEMENT_TAG_NAME]: HlsElement;
  }
}
