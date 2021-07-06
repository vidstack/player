import { FullscreenEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends FullscreenEvents {}
}
