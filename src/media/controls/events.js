import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *   display: boolean;
 *   show(): Promise<void>;
 *   hide(): Promise<void>;
 * }} Controls
 */

/**
 * @typedef {{
 *   [ControlsChangeEvent.TYPE]: ControlsChangeEvent;
 *   [ControlsConnectEvent.TYPE]: ControlsConnectEvent;
 * }} MediaControlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class MediaControlsEvent extends VdsCustomEvent {}

/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 * @augments MediaControlsEvent<ControlsConnectEventDetail>
 */
export class ControlsConnectEvent extends MediaControlsEvent {
  /** @readonly */
  static TYPE = 'vds-controls-manager-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * Fired by the `MediaControllerElement` when the controls visiblity changes. The event detail
 * contains a `boolean` that indicates if the controls are visible (`true`) or not (`false`).
 *
 * @augments MediaControlsEvent<boolean>
 */
export class ControlsChangeEvent extends MediaControlsEvent {
  /** @readonly */
  static TYPE = 'vds-controls-change';
}
