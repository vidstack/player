import { ElementManagerEvents } from './ElementManager';

declare global {
  interface GlobalEventHandlersEventMap extends ElementManagerEvents {}
}
