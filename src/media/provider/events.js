import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [MediaProviderConnectEvent.TYPE]: MediaProviderConnectEvent;
 * }} MediaProviderEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class MediaProviderEvent extends VdsCustomEvent {}

/**
 * @typedef {{
 *  provider: any;
 *  onDisconnect: (callback: () => void) => void;
 * }} MediaProviderConnectEventDetail
 */

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 * @augments {MediaProviderEvent<MediaProviderConnectEventDetail>}
 */
export class MediaProviderConnectEvent extends MediaProviderEvent {
  /** @readonly */
  static TYPE = 'vds-media-provider-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
