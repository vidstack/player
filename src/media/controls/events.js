import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *   [ControlsChangeEvent.TYPE]: ControlsChangeEvent;
 *   [IdleChangeEvent.TYPE]: IdleChangeEvent;
 *   [HideControlsRequestEvent.TYPE]: HideControlsRequestEvent;
 *   [ShowControlsRequestEvent.TYPE]: ShowControlsRequestEvent;
 *   [LockControlsRequestEvent.TYPE]: LockControlsRequestEvent;
 * }} ControlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ControlsEvent extends VdsCustomEvent {}

/**
 * Fired when the controls visiblity changes. The event detail contains a `boolean` that indicates
 * if the controls are visible (`true`) or not (`false`).
 *
 * @augments {ControlsEvent<boolean>}
 */
export class ControlsChangeEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-controls-change';
}

/**
 * Fired when the idle state changes depending on user activity. The event detail contains a
 * `boolean` that indicates if idle (`true`) or not (`false`).
 *
 * @augments {ControlsEvent<boolean>}
 */
export class IdleChangeEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-idle-change';
}

/**
 * Fired when requesting the controls to be shown.
 *
 * @bubbles
 * @composed
 * @augments {ControlsEvent<void>}
 */
export class ShowControlsRequestEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-show-controls-request';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * Fired when requesting the controls to be hidden.
 *
 * @bubbles
 * @composed
 * @augments {ControlsEvent<void>}
 */
export class HideControlsRequestEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-hide-controls-request';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * @readonly
 * @enum {string}
 */
export const ControlsLock = {
  None: 'none',
  Showing: 'showing',
  Hidden: 'hidden'
};

/**
 * Fired when requesting the controls to be locked to `showing` or `hidden`.
 *
 * @bubbles
 * @composed
 * @augments {ControlsEvent<ControlsLock>}
 */
export class LockControlsRequestEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-lock-controls-request';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}
