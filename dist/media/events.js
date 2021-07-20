import { VdsCustomEvent } from '../foundation/events/index.js';
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
export class MediaEvent extends VdsCustomEvent {}
/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 * @augments {MediaEvent<void>}
 */
export class AbortEvent extends MediaEvent {}
/** @readonly */
AbortEvent.TYPE = 'vds-abort';
/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 * @augments {MediaEvent<void>}
 */
export class CanPlayEvent extends MediaEvent {}
/** @readonly */
CanPlayEvent.TYPE = 'vds-can-play';
/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 * @augments {MediaEvent<void>}
 */
export class CanPlayThroughEvent extends MediaEvent {}
/** @readonly */
CanPlayThroughEvent.TYPE = 'vds-can-play-through';
/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 * @augments {MediaEvent<number>}
 */
export class DurationChangeEvent extends MediaEvent {}
/** @readonly */
DurationChangeEvent.TYPE = 'vds-duration-change';
/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 * @augments {MediaEvent<void>}
 */
export class EmptiedEvent extends MediaEvent {}
/** @readonly */
EmptiedEvent.TYPE = 'vds-emptied';
/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 * @augments {MediaEvent<void>}
 */
export class EndedEvent extends MediaEvent {}
/** @readonly */
EndedEvent.TYPE = 'vds-ended';
/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 * @augments {MediaEvent<unknown>}
 */
export class ErrorEvent extends MediaEvent {}
/** @readonly */
ErrorEvent.TYPE = 'vds-error';
/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 * @augments {MediaEvent<void>}
 */
export class LoadedDataEvent extends MediaEvent {}
/** @readonly */
LoadedDataEvent.TYPE = 'vds-loaded-data';
/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 * @augments {MediaEvent<void>}
 */
export class LoadedMetadataEvent extends MediaEvent {}
/** @readonly */
LoadedMetadataEvent.TYPE = 'vds-loaded-metadata';
/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 * @augments {MediaEvent<void>}
 */
export class LoadStartEvent extends MediaEvent {}
/** @readonly */
LoadStartEvent.TYPE = 'vds-load-start';
/**
 * Fired when the `mediaType` property changes value.
 *
 * @augments {MediaEvent<MediaType>}
 */
export class MediaTypeChangeEvent extends MediaEvent {}
/** @readonly */
MediaTypeChangeEvent.TYPE = 'vds-media-type-change';
/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 * @augments {MediaEvent<void>}
 */
export class PauseEvent extends MediaEvent {}
/** @readonly */
PauseEvent.TYPE = 'vds-pause';
/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 * @augments {MediaEvent<void>}
 */
export class PlayEvent extends MediaEvent {}
/** @readonly */
PlayEvent.TYPE = 'vds-play';
/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 * @augments {MediaEvent<void>}
 */
export class PlayingEvent extends MediaEvent {}
/** @readonly */
PlayingEvent.TYPE = 'vds-playing';
/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 * @augments {MediaEvent<void>}
 */
export class ProgressEvent extends MediaEvent {}
/** @readonly */
ProgressEvent.TYPE = 'vds-progress';
/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 * @augments {MediaEvent<number>}
 */
export class SeekedEvent extends MediaEvent {}
/** @readonly */
SeekedEvent.TYPE = 'vds-seeked';
/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 * @augments {MediaEvent<number>}
 */
export class SeekingEvent extends MediaEvent {}
/** @readonly */
SeekingEvent.TYPE = 'vds-seeking';
/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 * @augments {MediaEvent<void>}
 */
export class StalledEvent extends MediaEvent {}
/** @readonly */
StalledEvent.TYPE = 'vds-stalled';
/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 *
 * @augments {MediaEvent<void>}
 */
export class StartedEvent extends MediaEvent {}
/** @readonly */
StartedEvent.TYPE = 'vds-started';
/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 * @augments {MediaEvent<void>}
 */
export class SuspendEvent extends MediaEvent {}
/** @readonly */
SuspendEvent.TYPE = 'vds-suspend';
/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 *
 * @augments {MediaEvent<void>}
 */
export class ReplayEvent extends MediaEvent {}
/** @readonly */
ReplayEvent.TYPE = 'vds-replay';
/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 * @augments {MediaEvent<number>}
 */
export class TimeUpdateEvent extends MediaEvent {}
/** @readonly */
TimeUpdateEvent.TYPE = 'vds-time-update';
/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @augments {MediaEvent<ViewType>}
 */
export class ViewTypeChangeEvent extends MediaEvent {}
/** @readonly */
ViewTypeChangeEvent.TYPE = 'vds-view-type-change';
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
export class VolumeChangeEvent extends MediaEvent {}
/** @readonly */
VolumeChangeEvent.TYPE = 'vds-volume-change';
/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 * @augments {MediaEvent<void>}
 */
export class WaitingEvent extends MediaEvent {}
/** @readonly */
WaitingEvent.TYPE = 'vds-waiting';
