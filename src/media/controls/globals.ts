import { ControlsEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends ControlsEvents {}
}
