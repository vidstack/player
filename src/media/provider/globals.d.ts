import { MediaProviderEvents } from './events.js';

declare global {
  interface GlobalEventHandlersEventMap extends MediaProviderEvents {}
}
