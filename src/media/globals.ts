import { MediaEvents } from './media.events.js';
import { MediaRequestEvents } from './media-request.events.js';

declare global {
  interface GlobalEventHandlersEventMap
    extends MediaEvents,
      MediaRequestEvents {}
}
