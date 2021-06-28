import { VdsCustomEvent } from '../../foundation/events/index.js';
import { MediaContainerElement } from './MediaContainerElement.js';

/**
 * @typedef {{
 *   [MediaContainerConnectEvent.TYPE]: MediaContainerConnectEvent
 * }} MediaContainerEvents
 */

/**
 * @template DetailType
 * @extends {VdsCustomEvent<DetailType>}
 */
export class MediaContainerEvent extends VdsCustomEvent {}

/**
 * @typedef {{
 *  container: MediaContainerElement;
 *  onDisconnect: (callback: () => void) => void;
 * }} MediaContainerConnectEventDetail
 */

/**
 * @extends MediaContainerEvent<MediaContainerConnectEventDetail>
 */
export class MediaContainerConnectEvent extends MediaContainerEvent {
  /** @readonly */
  static TYPE = 'vds-media-container-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
