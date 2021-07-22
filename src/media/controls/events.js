import { VdsEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *   'vds-controls-change': ControlsChangeEvent;
 *   'vds-show-controls-request': HideControlsRequestEvent;
 *   'vds-hide-controls-request': ShowControlsRequestEvent;
 * }} ControlsEvents
 */

/**
 * Fired when the controls are being shown/hidden. This does not mean they are visible, only that
 * they are or are not available to the user. For visiblity refer to `IdleChangeEvent`. The event
 * detail contains a `boolean` that indicates if the controls are shown (`true`) or not (`false`).
 *
 * @event
 * @typedef {VdsEvent<boolean>} ControlsChangeEvent
 */

/**
 * Fired when requesting the controls to be shown.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} ShowControlsRequestEvent
 */

/**
 * Fired when requesting the controls to be hidden.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} HideControlsRequestEvent
 */

/**
 * @typedef {{
 *   'vds-idle-change': IdleChangeEvent;
 *   'vds-pause-idle-tracking': PauseIdleTrackingRequestEvent;
 *   'vds-resume-idle-tracking': ResumeIdleTrackingRequestEvent;
 * }} IdleEvents
 */

/**
 * Fired when the idle state changes depending on user activity. The event detail contains a
 * `boolean` that indicates if idle (`true`) or not (`false`).
 *
 * @typedef {VdsEvent<boolean>} IdleChangeEvent
 */

/**
 * Fired when requesting to pause tracking idle state. This will also set the idle state
 * to `false`.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<boolean>} PauseIdleTrackingRequestEvent
 */

/**
 * Fired when requesting to resume tracking idle state.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<boolean>} ResumeIdleTrackingRequestEvent
 */
