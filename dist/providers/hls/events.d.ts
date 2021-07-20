/**
 * @typedef {{
 *  [HlsEngineBuiltEvent.TYPE]: HlsEngineBuiltEvent;
 *  [HlsEngineDetachEvent.TYPE]: HlsEngineDetachEvent;
 *  [HlsEngineAttachEvent.TYPE]: HlsEngineAttachEvent;
 *  [HlsEngineNoSupportEvent.TYPE]: HlsEngineNoSupportEvent;
 * }} HlsEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class HlsEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineBuiltEvent extends HlsEvent<Hls> {
    /** @readonly */
    static readonly TYPE: "vds-hls-engine-built";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<Hls> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineAttachEvent extends HlsEvent<Hls> {
    /** @readonly */
    static readonly TYPE: "vds-hls-engine-attach";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<Hls> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineDetachEvent extends HlsEvent<Hls> {
    /** @readonly */
    static readonly TYPE: "vds-hls-engine-detach";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<Hls> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 *
 * @augments {HlsEvent<void>}
 */
export class HlsEngineNoSupportEvent extends HlsEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-hls-engine-no-support";
    constructor(eventInit?: import("../../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type HlsEvents = {
    [HlsEngineBuiltEvent.TYPE]: HlsEngineBuiltEvent;
    [HlsEngineDetachEvent.TYPE]: HlsEngineDetachEvent;
    [HlsEngineAttachEvent.TYPE]: HlsEngineAttachEvent;
    [HlsEngineNoSupportEvent.TYPE]: HlsEngineNoSupportEvent;
};
import { VdsCustomEvent } from "../../foundation/events/events.js";
import Hls from "hls.js";
