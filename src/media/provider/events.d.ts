import { VdsCustomEvent, VdsEventInit } from '../../foundation/events/index.js';
import { MediaProviderElement } from './MediaProviderElement.js';

declare global {
  interface GlobalEventHandlersEventMap extends MediaProviderEvents {}
}

export interface MediaProviderConnectEventDetail {
  provider: MediaProviderElement;
  onDisconnect: (callback: () => void) => void;
}

export interface MediaProviderEvents {
  'vds-media-provider-connect': VdsCustomEvent<MediaProviderConnectEventDetail>;
}

export class MediaProviderEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof MediaProviderEvents;
}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class MediaProviderConnectEvent extends MediaProviderEvent<MediaProviderConnectEventDetail> {
  static readonly TYPE = 'vds-media-provider-connect';
  constructor(eventInit: VdsEventInit<MediaProviderConnectEventDetail>);
}
