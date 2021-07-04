import { ElementManagerEvents } from './events.js';

declare global {
  interface GlobalEventHandlersEventMap extends ElementManagerEvents {}
}
