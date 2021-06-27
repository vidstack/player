import { VdsCustomEvent, VdsEventInit } from '../../shared/events/index.js';
import { MediaContainerElement } from './MediaContainerElement.js';

declare global {
  interface GlobalEventHandlersEventMap extends VdsMediaContainerEvents {}
}

export interface MediaContainerConnectEventDetail {
  container: MediaContainerElement;
  onDisconnect: (callback: () => void) => void;
}

export interface VdsMediaContainerEvents {
  'vds-media-container-connect': VdsCustomEvent<MediaContainerConnectEventDetail>;
}

export class VdsMediaContainerEvent<
  DetailType
> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof VdsMediaContainerEvents;
}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class VdsMediaContainerConnectEvent extends VdsMediaContainerEvent<MediaContainerConnectEventDetail> {
  static readonly TYPE = 'vds-media-container-connect';
  constructor(eventInit: VdsEventInit<MediaContainerConnectEventDetail>);
}
