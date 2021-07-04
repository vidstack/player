import { VdsCustomEvent } from '../../events/index.js';

/**
 * @template {Element} ManagedElement
 * @typedef {{
 *  element: ManagedElement;
 *  onDisconnect: (callback: () => void) => void;
 * }} ManagedElementConnectEventDetail
 */

/**
 * @typedef {{
 *  [ManagedElementConnectEvent.TYPE]: ManagedElementConnectEvent;
 * }} ElementManagerEvents
 */

/**
 * @template {Element} ManagedElement
 * @augments VdsCustomEvent<ManagedElementConnectEventDetail<ManagedElement>>
 * @bubbles
 * @composed
 */
export class ManagedElementConnectEvent extends VdsCustomEvent {
  /** @readonly */
  static TYPE = 'vds-managed-element-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
