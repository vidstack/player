import { ControlsEvents, IdleEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends ControlsEvents, IdleEvents {}
}
