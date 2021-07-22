import { VdsEvent } from '../events/index.js';

/**
 * @typedef {{
 *   'vds-fullscreen-change': FullscreenChangeEvent;
 *   'vds-fullscreen-error': FullscreenErrorEvent;
 * }} FullscreenEvents
 */

/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @event
 * @typedef {VdsEvent<boolean>} FullscreenChangeEvent
 */

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @event
 * @typedef {VdsEvent<unknown>} FullscreenErrorEvent
 */
