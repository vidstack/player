import { safelyDefineCustomElement } from '../../utils/dom';
import { HLS_ELEMENT_TAG_NAME, HlsElement } from './HlsElement';

safelyDefineCustomElement(HLS_ELEMENT_TAG_NAME, HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    [HLS_ELEMENT_TAG_NAME]: HlsElement;
  }
}
