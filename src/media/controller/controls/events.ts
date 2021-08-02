import { VdsEvent } from '../../../base/events';

export type ControlsEvents = {
  'vds-controls-change': ControlsChangeEvent;
  'vds-show-controls-request': ShowControlsRequestEvent;
  'vds-hide-controls-request': HideControlsRequestEvent;
};

/**
 * Fired when custom controls are being shown/hidden. The event detail contains a `boolean` that
 * indicates if the controls are showing (`true`) or not (`hidden`). Do not use this to track
 * visibility, generally best to refer to the `IdleChangeEvent` for that.
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
 * Fired when requesting the controls to be hidden.
 *
 * @event
 */
export type HideControlsRequestEvent = VdsEvent<boolean>;
