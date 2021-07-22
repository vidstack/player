import { VdsEvent } from '../../events/index.js';

/**
 * @template {Element} T
 * @typedef {{
 *  element: T;
 *  onDisconnect: (callback: () => void) => void;
 * }} DiscoveryEventDetail
 */

/**
 * @event
 * @bubbles
 * @composed
 * @template {Element} T
 * @typedef {VdsEvent<DiscoveryEventDetail<T>>} DiscoveryEvent
 */

/**
 * @template {Element} T
 * @typedef {{
 *   TYPE: keyof GlobalEventHandlersEventMap;
 *   new(...args: any): DiscoveryEvent<any>;
 * }} ScopedDiscoveryEvent<T>
 */
