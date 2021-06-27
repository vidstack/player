import { VdsCustomEvent, VdsEventInit } from '../../shared/events/index.js';
import { MediaContainerElement } from './MediaContainerElement.js';

declare global {
  interface GlobalEventHandlersEventMap extends MediaContainerEvents {}
}

export interface MediaContainerConnectEventDetail {
  container: MediaContainerElement;
  onDisconnect: (callback: () => void) => void;
}

export interface MediaContainerEvents {
  'vds-media-container-connect': VdsCustomEvent<MediaContainerConnectEventDetail>;
}

export class MediaContainerEvent<
  DetailType
> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof MediaContainerEvents;
}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class MediaContainerConnectEvent extends MediaContainerEvent<MediaContainerConnectEventDetail> {
  static readonly TYPE = 'vds-media-container-connect';
  constructor(eventInit: VdsEventInit<MediaContainerConnectEventDetail>);
}
