import { VdsEvent } from '@base/events/index';

export type ControlsEvents = {
  'vds-controls-change': ControlsChangeEvent;
  'vds-show-controls-request': ShowControlsRequestEvent;
  'vds-hide-controls-request': HideControlsRequestEvent;
};

/**
 * Fired when requesting the controls to be hidden.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ControlsChangeEvent = VdsEvent<boolean>;

/**
 * Fired when requesting the controls to be shown.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ShowControlsRequestEvent = VdsEvent<void>;

/**
 * Fired when the controls are being shown/hidden. This does not mean they are visible, only that
 * they are or are not available to the user. For visiblity refer to `IdleChangeEvent`. The event
 * detail contains a `boolean` that indicates if the controls are shown (`true`) or not (`false`).
 *
 * @event
 */
export type HideControlsRequestEvent = VdsEvent<boolean>;

export type IdleEvents = {
  'vds-idle-change': IdleChangeEvent;
  'vds-pause-idle-tracking': PauseIdleTrackingRequestEvent;
  'vds-resume-idle-tracking': ResumeIdleTrackingRequestEvent;
};

/**
 * Fired when the idle state changes depending on user activity. The event detail contains a
 * `boolean` that indicates if idle (`true`) or not (`false`).
 *
 */
export type IdleChangeEvent = VdsEvent<boolean>;

/**
 * Fired when requesting to resume tracking idle state.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ResumeIdleTrackingRequestEvent = VdsEvent<boolean>;

/**
 * Fired when requesting to pause tracking idle state. This will also set the idle state
 * to `false`.
 *
 * @event
 * @bubbles
 * @composed
 */
export type PauseIdleTrackingRequestEvent = VdsEvent<boolean>;
