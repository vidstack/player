import { VdsCustomEvent } from '../foundation/events/index.js';
import { MediaType } from './MediaType.js';
import { ViewType } from './ViewType.js';

/**
 * @typedef {{
 *  [AbortEvent.TYPE]: AbortEvent;
 *  [CanPlayEvent.TYPE]: CanPlayEvent;
 *  [CanPlayThroughEvent.TYPE]: CanPlayThroughEvent;
 *  [DurationChangeEvent.TYPE]: DurationChangeEvent;
 *  [EmptiedEvent.TYPE]: EmptiedEvent;
 *  [EndedEvent.TYPE]: EndedEvent;
 *  [ErrorEvent.TYPE]: ErrorEvent;
 *  [FullscreenChangeEvent.TYPE]: FullscreenChangeEvent;
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
 * @extends {VdsCustomEvent<DetailType>}
 */
export class MediaEvent extends VdsCustomEvent {}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 * @extends {MediaEvent<void>}
 */
export class AbortEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-abort';
}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 * @extends {MediaEvent<void>}
 */
export class CanPlayEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-can-play';
}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 * @extends {MediaEvent<void>}
 */
export class CanPlayThroughEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-can-play-through';
}

/**
 * Fired when the `duration` property changes.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 * @extends {MediaEvent<number>}
 */
export class DurationChangeEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-duration-change';
}

/**
 * Fired when the media has become empty.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 * @extends {MediaEvent<void>}
 */
export class EmptiedEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-emptied';
}

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`).
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 * @extends {MediaEvent<void>}
 */
export class EndedEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-ended';
}

/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 * @extends {MediaEvent<unknown>}
 */
export class ErrorEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-error';
}

/**
 * Fired when the player enters/exits fullscreen mode. When the detail is `true` it means
 * the player has entered fullscreen, `false` represents the opposite.
 * @extends {MediaEvent<boolean>}
 */
export class FullscreenChangeEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-fullscreen-change';
}

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 * @extends {MediaEvent<void>}
 */
export class LoadedDataEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-loaded-data';
}

/**
 * Fired when the metadata has been loaded.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 * @extends {MediaEvent<void>}
 */
export class LoadedMetadataEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-loaded-metadata';
}

/**
 * Fired when the browser has started to load a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 * @extends {MediaEvent<void>}
 */
export class LoadStartEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-load-start';
}

/**
 * Fired when the `mediaType` property changes value.
 * @extends {MediaEvent<MediaType>}
 */
export class MediaTypeChangeEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-media-type-change';
}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 * @extends {MediaEvent<void>}
 */
export class PauseEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-pause';
}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 * @extends {MediaEvent<void>}
 */
export class PlayEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-play';
}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 * @extends {MediaEvent<void>}
 */
export class PlayingEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-playing';
}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 * @extends {MediaEvent<void>}
 */
export class ProgressEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-progress';
}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 * @extends {MediaEvent<number>}
 */
export class SeekedEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-seeked';
}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 * @extends {MediaEvent<number>}
 */
export class SeekingEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-seeking';
}

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 * @extends {MediaEvent<void>}
 */
export class StalledEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-stalled';
}

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 *
 * @extends {MediaEvent<void>}
 */
export class StartedEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-started';
}

/**
 * Fired when media data loading has been suspended.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 * @extends {MediaEvent<void>}
 */
export class SuspendEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-suspend';
}

/**
 * Fired when media playback starts from the beginning again due to the `loop` property being
 * set to `true`.
 *
 * @extends {MediaEvent<void>}
 */
export class ReplayEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-replay';
}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 * @extends {MediaEvent<number>}
 */
export class TimeUpdateEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-time-update';
}

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @extends {MediaEvent<ViewType>}
 */
export class ViewTypeChangeEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-view-type-change';
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
 * @extends {MediaEvent<VolumeChange>}
 */
export class VolumeChangeEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-volume-change';
}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 * @extends {MediaEvent<void>}
 */
export class WaitingEvent extends MediaEvent {
  /** @readonly */
  static TYPE = 'vds-waiting';
}
