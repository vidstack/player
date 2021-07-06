import { MediaProviderConnectEvent } from './MediaProviderElement.js';

declare global {
  interface GlobalEventHandlersEventMap {
    [MediaProviderConnectEvent.TYPE]: MediaProviderConnectEvent;
  }
}
