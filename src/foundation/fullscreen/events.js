import { VdsCustomEvent } from '../events/index.js';

/**
 * @typedef {{
 *   [FullscreenChangeEvent.TYPE]: FullscreenChangeEvent;
 *   [FullscreenErrorEvent.TYPE]: FullscreenErrorEvent;
 * }} FullscreenEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class FullscreenEvent extends VdsCustomEvent {}

/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @augments {FullscreenEvent<boolean>}
 */
export class FullscreenChangeEvent extends FullscreenEvent {
  /** @readonly */
  static TYPE = 'vds-fullscreen-change';
}

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @augments {FullscreenEvent<unknown>}
 */
export class FullscreenErrorEvent extends FullscreenEvent {
  /** @readonly */
  static TYPE = 'vds-fullscreen-error';
}
