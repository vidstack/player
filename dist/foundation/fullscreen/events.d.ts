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
export class FullscreenEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @augments {FullscreenEvent<boolean>}
 */
export class FullscreenChangeEvent extends FullscreenEvent<boolean> {
    /** @readonly */
    static readonly TYPE: "vds-fullscreen-change";
    constructor(eventInit?: import("../events/events.js").VdsEventInit<boolean> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @augments {FullscreenEvent<unknown>}
 */
export class FullscreenErrorEvent extends FullscreenEvent<unknown> {
    /** @readonly */
    static readonly TYPE: "vds-fullscreen-error";
    constructor(eventInit?: import("../events/events.js").VdsEventInit<unknown> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type FullscreenEvents = {
    [FullscreenChangeEvent.TYPE]: FullscreenChangeEvent;
    [FullscreenErrorEvent.TYPE]: FullscreenErrorEvent;
};
import { VdsCustomEvent } from "../events/events.js";
