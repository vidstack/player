import { SliderEvents } from './events.js';
import { SLIDER_ELEMENT_TAG_NAME, SliderElement } from './SliderElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [SLIDER_ELEMENT_TAG_NAME]: SliderElement;
  }

  interface GlobalEventHandlersEventMap extends SliderEvents {}
}
