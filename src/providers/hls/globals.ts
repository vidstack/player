import { HlsEvents } from './events.js';
import { HLS_ELEMENT_TAG_NAME, HlsElement } from './HlsElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [HLS_ELEMENT_TAG_NAME]: HlsElement;
  }

  interface GlobalEventHandlersEventMap extends HlsEvents {}
}
