/**
 * @typedef {{
 *  [AbortEvent.TYPE]: AbortEvent;
 *  [CanPlayEvent.TYPE]: CanPlayEvent;
 *  [CanPlayThroughEvent.TYPE]: CanPlayThroughEvent;
 *  [DurationChangeEvent.TYPE]: DurationChangeEvent;
 *  [EmptiedEvent.TYPE]: EmptiedEvent;
 *  [EndedEvent.TYPE]: EndedEvent;
 *  [ErrorEvent.TYPE]: ErrorEvent;
 *  [LoadedDataEvent.TYPE]: LoadedDataEvent;
 *  [LoadedMetadataEvent.TYPE]: LoadedMetadataEvent;
 *  [LoadStartEvent.TYPE]: LoadStartEvent;
 *  [MediaTypeChangeEvent.TYPE]: MediaTypeChangeEvent;
 *  [PauseEvent.TYPE]: PauseEvent;
 *  [PlayEvent.TYPE]: PlayEvent;
 *  [PlayingEvent.TYPE]: PlayingEvent;
 *  [ProgressEvent.TYPE]: ProgressEvent;
 *  [SeekedEvent.TYPE]: SeekedEvent;
 *  [SeekingEvent.TYPE]: SeekingEvent;
 *  [StalledEvent.TYPE]: StalledEvent;
 *  [StartedEvent.TYPE]: StartedEvent;
 *  [SuspendEvent.TYPE]: SuspendEvent;
 *  [ReplayEvent.TYPE]: ReplayEvent;
 *  [TimeUpdateEvent.TYPE]: TimeUpdateEvent;
 *  [ViewTypeChangeEvent.TYPE]: ViewTypeChangeEvent;
 *  [VolumeChangeEvent.TYPE]: VolumeChangeEvent;
 *  [WaitingEvent.TYPE]: WaitingEvent;
 * }} MediaEvents
 */
/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class MediaEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 * @augments {MediaEvent<void>}
 */
export class AbortEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-abort";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 * @augments {MediaEvent<void>}
 */
export class CanPlayEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-can-play";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 * @augments {MediaEvent<void>}
 */
export class CanPlayThroughEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-can-play-through";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 * @augments {MediaEvent<number>}
 */
export class DurationChangeEvent extends MediaEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-duration-change";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 * @augments {MediaEvent<void>}
 */
export class EmptiedEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-emptied";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 * @augments {MediaEvent<void>}
 */
export class EndedEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-ended";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 * @augments {MediaEvent<unknown>}
 */
export class ErrorEvent extends MediaEvent<unknown> {
    /** @readonly */
    static readonly TYPE: "vds-error";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<unknown> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 * @augments {MediaEvent<void>}
 */
export class LoadedDataEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-loaded-data";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 * @augments {MediaEvent<void>}
 */
export class LoadedMetadataEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-loaded-metadata";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 * @augments {MediaEvent<void>}
 */
export class LoadStartEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-load-start";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `mediaType` property changes value.
 *
 * @augments {MediaEvent<MediaType>}
 */
export class MediaTypeChangeEvent extends MediaEvent<string> {
    /** @readonly */
    static readonly TYPE: "vds-media-type-change";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<string> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 * @augments {MediaEvent<void>}
 */
export class PauseEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-pause";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 * @augments {MediaEvent<void>}
 */
export class PlayEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-play";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 * @augments {MediaEvent<void>}
 */
export class PlayingEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-playing";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 * @augments {MediaEvent<void>}
 */
export class ProgressEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-progress";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 * @augments {MediaEvent<number>}
 */
export class SeekedEvent extends MediaEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-seeked";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 * @augments {MediaEvent<number>}
 */
export class SeekingEvent extends MediaEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-seeking";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 * @augments {MediaEvent<void>}
 */
export class StalledEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-stalled";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 *
 * @augments {MediaEvent<void>}
 */
export class StartedEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-started";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 * @augments {MediaEvent<void>}
 */
export class SuspendEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-suspend";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 *
 * @augments {MediaEvent<void>}
 */
export class ReplayEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-replay";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 * @augments {MediaEvent<number>}
 */
export class TimeUpdateEvent extends MediaEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-time-update";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @augments {MediaEvent<ViewType>}
 */
export class ViewTypeChangeEvent extends MediaEvent<string> {
    /** @readonly */
    static readonly TYPE: "vds-view-type-change";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<string> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * @typedef {{
 *  volume: number;
 *  muted: boolean;
 * }} VolumeChange
 */
/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 * @augments {MediaEvent<VolumeChange>}
 */
export class VolumeChangeEvent extends MediaEvent<VolumeChange> {
    /** @readonly */
    static readonly TYPE: "vds-volume-change";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<VolumeChange> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 * @augments {MediaEvent<void>}
 */
export class WaitingEvent extends MediaEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-waiting";
    constructor(eventInit?: import("../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type MediaEvents = {
    [AbortEvent.TYPE]: AbortEvent;
    [CanPlayEvent.TYPE]: CanPlayEvent;
    [CanPlayThroughEvent.TYPE]: CanPlayThroughEvent;
    [DurationChangeEvent.TYPE]: DurationChangeEvent;
    [EmptiedEvent.TYPE]: EmptiedEvent;
    [EndedEvent.TYPE]: EndedEvent;
    [ErrorEvent.TYPE]: ErrorEvent;
    [LoadedDataEvent.TYPE]: LoadedDataEvent;
    [LoadedMetadataEvent.TYPE]: LoadedMetadataEvent;
    [LoadStartEvent.TYPE]: LoadStartEvent;
    [MediaTypeChangeEvent.TYPE]: MediaTypeChangeEvent;
    [PauseEvent.TYPE]: PauseEvent;
    [PlayEvent.TYPE]: PlayEvent;
    [PlayingEvent.TYPE]: PlayingEvent;
    [ProgressEvent.TYPE]: ProgressEvent;
    [SeekedEvent.TYPE]: SeekedEvent;
    [SeekingEvent.TYPE]: SeekingEvent;
    [StalledEvent.TYPE]: StalledEvent;
    [StartedEvent.TYPE]: StartedEvent;
    [SuspendEvent.TYPE]: SuspendEvent;
    [ReplayEvent.TYPE]: ReplayEvent;
    [TimeUpdateEvent.TYPE]: TimeUpdateEvent;
    [ViewTypeChangeEvent.TYPE]: ViewTypeChangeEvent;
    [VolumeChangeEvent.TYPE]: VolumeChangeEvent;
    [WaitingEvent.TYPE]: WaitingEvent;
};
export type VolumeChange = {
    volume: number;
    muted: boolean;
};
import { VdsCustomEvent } from "../foundation/events/events.js";
