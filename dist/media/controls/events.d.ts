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
export class ControlsEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the controls are being shown/hidden. This does not mean they are visible, only that
 * they are or are not available to the user. For visiblity refer to `IdleChangeEvent`. The event
 * detail contains a `boolean` that indicates if the controls are shown (`true`) or not (`false`).
 *
 * @augments {ControlsEvent<boolean>}
 */
export class ControlsChangeEvent extends ControlsEvent<boolean> {
    /** @readonly */
    static readonly TYPE: "vds-controls-change";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<boolean> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting the controls to be shown.
 *
 * @bubbles
 * @composed
 * @augments {ControlsEvent<void>}
 */
export class ShowControlsRequestEvent extends ControlsEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-show-controls-request";
    static DEFAULT_BUBBLES: boolean;
    static DEFAULT_COMPOSED: boolean;
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting the controls to be hidden.
 *
 * @bubbles
 * @composed
 * @augments {ControlsEvent<void>}
 */
export class HideControlsRequestEvent extends ControlsEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-hide-controls-request";
    static DEFAULT_BUBBLES: boolean;
    static DEFAULT_COMPOSED: boolean;
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
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
export class IdleEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the idle state changes depending on user activity. The event detail contains a
 * `boolean` that indicates if idle (`true`) or not (`false`).
 *
 * @augments {IdleEvent<boolean>}
 */
export class IdleChangeEvent extends IdleEvent<boolean> {
    /** @readonly */
    static readonly TYPE: "vds-idle-change";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<boolean> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting to pause tracking idle state. This will also set the idle state
 * to `false`.
 *
 * @augments {IdleEvent<boolean>}
 */
export class PauseIdleTrackingRequestEvent extends IdleEvent<boolean> {
    /** @readonly */
    static readonly TYPE: "vds-pause-idle-tracking";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<boolean> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting to resume tracking idle state.
 *
 * @augments {IdleEvent<boolean>}
 */
export class ResumeIdleTrackingRequestEvent extends IdleEvent<boolean> {
    /** @readonly */
    static readonly TYPE: "vds-resume-idle-tracking";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<boolean> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type ControlsEvents = {
    [ControlsChangeEvent.TYPE]: ControlsChangeEvent;
    [HideControlsRequestEvent.TYPE]: HideControlsRequestEvent;
    [ShowControlsRequestEvent.TYPE]: ShowControlsRequestEvent;
};
export type IdleEvents = {
    [IdleChangeEvent.TYPE]: IdleChangeEvent;
    [PauseIdleTrackingRequestEvent.TYPE]: PauseIdleTrackingRequestEvent;
    [ResumeIdleTrackingRequestEvent.TYPE]: ResumeIdleTrackingRequestEvent;
};
import { VdsCustomEvent } from "../../foundation/events/events.js";
