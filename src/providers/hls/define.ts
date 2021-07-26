import { HLS_ELEMENT_TAG_NAME, HlsElement } from './HlsElement';

window.customElements.define(HLS_ELEMENT_TAG_NAME, HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    [HLS_ELEMENT_TAG_NAME]: HlsElement;
  }
}
