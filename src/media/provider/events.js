import { VdsCustomEvent } from '../../foundation/events/index.js';

export class MediaProviderEvent extends VdsCustomEvent {}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class MediaProviderConnectEvent extends MediaProviderEvent {
  static TYPE = 'vds-media-provider-connect';
  constructor(eventInit) {
    super(MediaProviderConnectEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}
