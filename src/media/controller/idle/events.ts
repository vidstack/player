import { VdsEvent } from '../../../base/events';

export type IdleEvents = {
  'vds-idle-change': IdleChangeEvent;
  'vds-resume-idle-tracking-request': ResumeIdleTrackingRequestEvent;
  'vds-pause-idle-tracking-request': PauseIdleTrackingRequestEvent;
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
