import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *   [ControlsChangeEvent.TYPE]: ControlsChangeEvent;
 *   [HideControlsRequestEvent.TYPE]: HideControlsRequestEvent;
 *   [ShowControlsRequestEvent.TYPE]: ShowControlsRequestEvent;
 * }} ControlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ControlsEvent extends VdsCustomEvent {}

/**
 * Fired when the controls are being shown/hidden. This does not mean they are visible, only that
 * they are or are not available to the user. For visiblity refer to `IdleChangeEvent`. The event
 * detail contains a `boolean` that indicates if the controls are shown (`true`) or not (`false`).
 *
 * @augments {ControlsEvent<boolean>}
 */
export class ControlsChangeEvent extends ControlsEvent {
  /** @readonly */
  static TYPE = 'vds-controls-change';
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
 * @typedef {{
 *   [IdleChangeEvent.TYPE]: IdleChangeEvent;
 *   [PauseIdleTrackingRequestEvent.TYPE]: PauseIdleTrackingRequestEvent;
 *   [ResumeIdleTrackingRequestEvent.TYPE]: ResumeIdleTrackingRequestEvent;
 * }} IdleEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class IdleEvent extends VdsCustomEvent {}

/**
 * Fired when the idle state changes depending on user activity. The event detail contains a
 * `boolean` that indicates if idle (`true`) or not (`false`).
 *
 * @augments {IdleEvent<boolean>}
 */
export class IdleChangeEvent extends IdleEvent {
  /** @readonly */
  static TYPE = 'vds-idle-change';
}

/**
 * Fired when requesting to pause tracking idle state. This will also set the idle state
 * to `false`.
 *
 * @augments {IdleEvent<boolean>}
 */
export class PauseIdleTrackingRequestEvent extends IdleEvent {
  /** @readonly */
  static TYPE = 'vds-pause-idle-tracking';
}

/**
 * Fired when requesting to resume tracking idle state.
 *
 * @augments {IdleEvent<boolean>}
 */
export class ResumeIdleTrackingRequestEvent extends IdleEvent {
  /** @readonly */
  static TYPE = 'vds-resume-idle-tracking';
}
