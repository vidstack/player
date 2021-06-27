import { VdsCustomEvent } from '../../shared/events/index.js';

export class VdsMediaProviderEvent extends VdsCustomEvent {}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class VdsMediaProviderConnectEvent extends VdsMediaProviderEvent {
  static TYPE = 'vds-media-provider-connect';
  constructor(eventInit) {
    super(VdsMediaProviderConnectEvent.TYPE, {
      bubbles: true,
      composed: true,
      ...eventInit
    });
  }
}
