import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from './BufferingIndicatorElement.js';
import { BufferingIndicatorEvents } from './events.js';

declare global {
  interface HTMLElementTagNameMap {
    [BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
  }

  interface GlobalEventHandlersEventMap extends BufferingIndicatorEvents {}
}
