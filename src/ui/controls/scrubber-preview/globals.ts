import { ScrubberPreviewEvents } from './events.js';
import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewConnectEvent,
  ScrubberPreviewElement
} from './ScrubberPreviewElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_PREVIEW_ELEMENT_TAG_NAME]: ScrubberPreviewElement;
  }

  interface GlobalEventHandlersEventMap extends ScrubberPreviewEvents {
    [ScrubberPreviewConnectEvent.TYPE]: ScrubberPreviewConnectEvent;
  }
}
