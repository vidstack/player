/**
 * @typedef {{
 *   [ScreenOrientationChangeEvent.TYPE]: ScreenOrientationChangeEvent;
 *   [ScreenOrientationLockChangeEvent.TYPE]: ScreenOrientationLockChangeEvent;
 * }} ScreenOrientationEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ScreenOrientationEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the current screen orientation changes.
 *
 * @augments {ScreenOrientationEvent<ScreenOrientation>}
 */
export class ScreenOrientationChangeEvent extends ScreenOrientationEvent<string> {
    /** @readonly */
    static readonly TYPE: "vds-screen-orientation-change";
    constructor(eventInit?: import("../events/events.js").VdsEventInit<string> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the current screen orientation lock changes.
 *
 * @augments {ScreenOrientationEvent<ScreenOrientationLock>}
 */
export class ScreenOrientationLockChangeEvent extends ScreenOrientationEvent<string> {
    /** @readonly */
    static readonly TYPE: "vds-screen-orientation-lock-change";
    constructor(eventInit?: import("../events/events.js").VdsEventInit<string> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type ScreenOrientationEvents = {
    [ScreenOrientationChangeEvent.TYPE]: ScreenOrientationChangeEvent;
    [ScreenOrientationLockChangeEvent.TYPE]: ScreenOrientationLockChangeEvent;
};
import { VdsCustomEvent } from "../events/events.js";
