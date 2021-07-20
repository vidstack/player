/**
 * @typedef {{
 *  [MuteRequestEvent.TYPE]: MuteRequestEvent;
 *  [UnmuteRequestEvent.TYPE]: UnmuteRequestEvent;
 *  [EnterFullscreenRequestEvent.TYPE]: EnterFullscreenRequestEvent;
 *  [ExitFullscreenRequestEvent.TYPE]: ExitFullscreenRequestEvent;
 *  [PlayRequestEvent.TYPE]: PlayRequestEvent;
 *  [PauseRequestEvent.TYPE]: PauseRequestEvent;
 *  [SeekRequestEvent.TYPE]: SeekRequestEvent;
 *  [SeekingRequestEvent.TYPE]: SeekingRequestEvent;
 *  [VolumeChangeRequestEvent.TYPE]: VolumeChangeRequestEvent;
 * }} MediaRequestEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class MediaRequestEvent<DetailType> extends VdsCustomEvent<DetailType> {
    static DEFAULT_BUBBLES: boolean;
    static DEFAULT_COMPOSED: boolean;
}
/**
 * Fired when requesting the media to be muted.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class MuteRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-mute-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class UnmuteRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-unmute-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting media to enter fullscreen.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class EnterFullscreenRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-enter-fullscreen-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting media to exit fullscreen.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class ExitFullscreenRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-exit-fullscreen-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class PlayRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-play-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<void>}
 */
export class PauseRequestEvent extends MediaRequestEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-pause-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<number>}
 */
export class SeekRequestEvent extends MediaRequestEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-seek-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<number>}
 */
export class SeekingRequestEvent extends MediaRequestEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-seeking-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 * @augments {MediaRequestEvent<number>}
 */
export class VolumeChangeRequestEvent extends MediaRequestEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-volume-change-request";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type MediaRequestEvents = {
    [MuteRequestEvent.TYPE]: MuteRequestEvent;
    [UnmuteRequestEvent.TYPE]: UnmuteRequestEvent;
    [EnterFullscreenRequestEvent.TYPE]: EnterFullscreenRequestEvent;
    [ExitFullscreenRequestEvent.TYPE]: ExitFullscreenRequestEvent;
    [PlayRequestEvent.TYPE]: PlayRequestEvent;
    [PauseRequestEvent.TYPE]: PauseRequestEvent;
    [SeekRequestEvent.TYPE]: SeekRequestEvent;
    [SeekingRequestEvent.TYPE]: SeekingRequestEvent;
    [VolumeChangeRequestEvent.TYPE]: VolumeChangeRequestEvent;
};
import { VdsCustomEvent } from "../foundation/events/events.js";
