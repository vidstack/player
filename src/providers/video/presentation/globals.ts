import { VideoPresentationEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends VideoPresentationEvents {}
}
