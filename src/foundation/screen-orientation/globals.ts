import { ScreenOrientationEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends ScreenOrientationEvents {}
}
