import { VdsCustomEvent } from '../../foundation/events/index.js';
import { MediaProviderElement } from './MediaProviderElement.js';

/**
 * @typedef {{
 *  [MediaProviderConnectEvent.TYPE]: MediaProviderConnectEvent;
 * }} MediaProviderEvents
 */

/**
 * @template DetailType
 * @extends {VdsCustomEvent<DetailType>}
 */
export class MediaProviderEvent extends VdsCustomEvent {}

/**
 * @typedef {{
 *  provider: MediaProviderElement;
 *  onDisconnect: (callback: () => void) => void;
 * }} MediaProviderConnectEventDetail
 */

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 * @extends {MediaProviderEvent<MediaProviderConnectEventDetail>}
 */
export class MediaProviderConnectEvent extends MediaProviderEvent {
  /** @readonly */
  static TYPE = 'vds-media-provider-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
