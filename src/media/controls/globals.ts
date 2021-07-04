import { MediaControlsEvents } from './events';

declare global {
  interface GlobalEventHandlersEventMap extends MediaControlsEvents {}
}
