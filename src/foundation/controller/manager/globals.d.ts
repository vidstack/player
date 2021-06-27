import { ControllerManagerEvents } from './events.js';

declare global {
  interface GlobalEventHandlersEventMap extends ControllerManagerEvents {}
}
