/**
 * @typedef {{
 *   [VideoPresentationChangeEvent.TYPE]: VideoPresentationChangeEvent;
 * }} VideoPresentationEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class VideoPresentationEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the video presentation mode changes. Only available in Safari.
 *
 * @augments {VideoPresentationEvent<import('../../../foundation/types').WebKitPresentationMode>}
 */
export class VideoPresentationChangeEvent extends VideoPresentationEvent<import("../../../foundation/types").WebKitPresentationMode> {
    /** @readonly */
    static readonly TYPE: "vds-video-presentation-change";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<import("../../../foundation/types").WebKitPresentationMode> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type VideoPresentationEvents = {
    [VideoPresentationChangeEvent.TYPE]: VideoPresentationChangeEvent;
};
import { VdsCustomEvent } from "../../../foundation/events/events.js";
