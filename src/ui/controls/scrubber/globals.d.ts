import { ScrubberEvents } from './events.js';
import {
  SCRUBBER_ELEMENT_TAG_NAME,
  ScrubberElement
} from './ScrubberElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_ELEMENT_TAG_NAME]: ScrubberElement;
  }

  interface GlobalEventHandlersEventMap extends ScrubberEvents {}
}
