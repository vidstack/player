import { VdsCustomEvent } from '../../events/index.js';

/**
 * @typedef {{
 *  controller: any;
 *  onDisconnect: (callback: () => void) => void;
 * }} ManagedControllerConnectEventDetail
 */

/**
 * @typedef {{
 *  [ManagedControllerConnectEvent.TYPE]: ManagedControllerConnectEvent;
 * }} ControllerManagerEvents
 */

/**
 * @augments VdsCustomEvent<ManagedControllerConnectEventDetail>
 * @bubbles
 * @composed
 */
export class ManagedControllerConnectEvent extends VdsCustomEvent {
  /** @readonly */
  static TYPE = 'vds-managed-controller-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
