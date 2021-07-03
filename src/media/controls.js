import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *   controls: boolean;
 * }} ControlsManager
 */

/**
 * @typedef {{
 *   manager: ControlsManager;
 *   onDisconnect: (callback: () => void) => void;
 * }} ControlsManagerConnectEventDetail
 */

/**
 * @typedef {{
 *   [ControlsManagerConnectEvent.TYPE]: ControlsManagerConnectEvent
 * }} MediaControlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class MediaControlsEvent extends VdsCustomEvent {
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 * @augments MediaControlsEvent<ControlsManagerConnectEventDetail>
 */
export class ControlsManagerConnectEvent extends MediaControlsEvent {
  /** @readonly */
  static TYPE = 'vds-controls-manager-connect';
}
