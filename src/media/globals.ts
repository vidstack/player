import { MediaEvents } from './events.js';
import { MediaRequestEvents } from './request.events.js';

declare global {
  interface GlobalEventHandlersEventMap
    extends MediaEvents,
      MediaRequestEvents {}
}
