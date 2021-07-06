import { VdsCustomEvent } from '../../events/index.js';

/**
 * @template {Element} T
 * @typedef {{
 *  element: T;
 *  onDisconnect: (callback: () => void) => void;
 * }} DiscoveryEventDetail
 */

/**
 * @template {Element} T
 * @typedef {{
 *   TYPE: string;
 *   new(...args: any): DiscoveryEvent<any>;
 * }} ScopedDiscoveryEvent<T>
 */

/**
 * @template {Element} T
 * @augments {VdsCustomEvent<DiscoveryEventDetail<T>>}
 */
export class DiscoveryEvent extends VdsCustomEvent {
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
