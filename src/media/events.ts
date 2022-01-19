import { VdsEvent } from '../base/events';
import {
  FullscreenChangeEvent,
  FullscreenErrorEvent,
  FullscreenSupportChange
} from '../base/fullscreen';
import { MediaType } from './MediaType';
import {
  MuteRequestEvent,
  PauseIdlingRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  ResumeIdlingRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from './request.events';
import { ViewType } from './ViewType';

export type MediaEvents = {
  'vds-abort': AbortEvent;
  'vds-autoplay-attempt': AutoplayAttemptEvent;
  'vds-autoplay-change': AutoplayChangeEvent;
  'vds-autoplay-fail': AutoplayFailEvent;
  'vds-autoplay': AutoplayEvent;
  'vds-can-play-through': CanPlayThroughEvent;
  'vds-can-play': CanPlayEvent;
  'vds-controls-change': ControlsChangeEvent;
  'vds-duration-change': DurationChangeEvent;
  'vds-emptied': EmptiedEvent;
  'vds-ended': EndedEvent;
  'vds-error': ErrorEvent;
  'vds-fullscreen-change': FullscreenChangeEvent;
  'vds-fullscreen-error': FullscreenErrorEvent;
  'vds-fullscreen-support-change': FullscreenSupportChange;
  'vds-idle-change': IdleChangeEvent;
  'vds-load-start': LoadStartEvent;
  'vds-loaded-data': LoadedDataEvent;
  'vds-loaded-metadata': LoadedMetadataEvent;
  'vds-loop-change': LoopChangeEvent;
  'vds-looped': LoopedEvent;
  'vds-media-type-change': MediaTypeChangeEvent;
  'vds-pause': PauseEvent;
  'vds-play-fail': PlayFailEvent;
  'vds-play': PlayEvent;
  'vds-playing': PlayingEvent;
  'vds-playsinline-change': PlaysinlineChangeEvent;
  'vds-poster-change': PosterChangeEvent;
  'vds-progress': ProgressEvent;
  'vds-replay': ReplayEvent;
  'vds-seeked': SeekedEvent;
  'vds-seeking': SeekingEvent;
  'vds-src-change': SrcChangeEvent;
  'vds-stalled': StalledEvent;
  'vds-started': StartedEvent;
  'vds-suspend': SuspendEvent;
  'vds-time-update': TimeUpdateEvent;
  'vds-view-type-change': ViewTypeChangeEvent;
  'vds-volume-change': VolumeChangeEvent;
  'vds-waiting': WaitingEvent;
};

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 */
export type AbortEvent = VdsEvent<void>;

/**
 * Fired when an autoplay attempt is about to be made. The event detail contains the
 * attempt count, and whether media is `muted` for this attempt.
 */
export type AutoplayAttemptEvent = VdsEvent<{
  attempt: number;
  muted: boolean;
}>;

/**
 * Fired when the `autoplay` property has changed value.
 *
 * @event
 */
export type AutoplayChangeEvent = VdsEvent<boolean>;

/**
 * Fired when an autoplay attempt has failed. The event detail contains the error that
 * had occurred on the last autoplay attempt which caused it to fail.
 *
 * @event
 */
export type AutoplayFailEvent = VdsEvent<unknown>;

/**
 * Fired when autoplay attempts are about to start. The event detail whether media is `muted`
 * before any attempts are made.
 *
 * @event
 */
export type AutoplayEvent = VdsEvent<{ muted: boolean }>;

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 */
export type CanPlayThroughEvent = VdsEvent<{ duration: number }>;

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 */
export type CanPlayEvent = VdsEvent<{ duration: number }>;

/**
 * Fired when the `controls` property has changed value.
 *
 * @event
 */
export type ControlsChangeEvent = VdsEvent<boolean>;

/**
 * Fired when the `duration` property changes.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 */
export type DurationChangeEvent = VdsEvent<number>;

/**
 * Fired when the media has become empty.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 */
export type EmptiedEvent = VdsEvent<void>;

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent` and `LoopedEvent`).
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 */
export type EndedEvent = VdsEvent<void>;

/**
 * Fired when any error has occurred within the player such as a media error, or
 * potentially a request that cannot be fulfilled such as calling `requestFullscreen()`.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 */
export type ErrorEvent = VdsEvent<unknown>;

/**
 * Fired when the media idle state changes. Media is idle when playback is progressing (playing),
 * and there is no user activity for a set period of time (default is 2.5s). The event
 * detail contains whether media is idle (`true`), or not (`false`).
 *
 * @event
 */
export type IdleChangeEvent = VdsEvent<boolean> & {
  requestEvent?: ResumeIdlingRequestEvent | PauseIdlingRequestEvent;
};

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 */
export type LoadedDataEvent = VdsEvent<void>;

/**
 * Fired when the metadata has been loaded.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 */
export type LoadedMetadataEvent = VdsEvent<{ src: string; duration: number }>;

/**
 * Fired when the `loop` property has changed value.
 *
 * @event
 */
export type LoopChangeEvent = VdsEvent<boolean>;

/**
 * Fired when the browser has started to load a resource.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 */
export type LoadStartEvent = VdsEvent<{
  src: string;
  poster: string;
  mediaType: MediaType;
  viewType: ViewType;
}>;

/**
 * Fired when the media is set to loop and playback reaches the end of media (right before it
 * starts again).
 */
export type LoopedEvent = VdsEvent<void>;

/**
 * Fired when the `mediaType` property changes value.
 *
 * @event
 */
export type MediaTypeChangeEvent = VdsEvent<MediaType>;

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 */
export type PauseEvent = VdsEvent<void> & {
  requestEvent?: PauseRequestEvent;
};

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 */
export type PlayEvent = VdsEvent<void> & {
  autoplay?: boolean;
  requestEvent?: PlayRequestEvent;
};

/**
 * Fired when an attempt to start media playback results in an error.
 */
export type PlayFailEvent = VdsEvent<void> & {
  autoplay?: boolean;
  error?: Error;
  requestEvent?: PlayRequestEvent;
};

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
 */
export type PlayingEvent = VdsEvent<void> & {
  triggerEvent?: PlayEvent | ReplayEvent | SeekedEvent;
};

/**
 * Fired when the `playsinline` property has changed value.
 *
 * @event
 */
export type PlaysinlineChangeEvent = VdsEvent<boolean>;

/**
 * Fired when the `currentPoster` property has changed value.
 *
 * @event
 */
export type PosterChangeEvent = VdsEvent<string>;

/**
 * Fired periodically as the browser loads a resource.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 */
export type ProgressEvent = VdsEvent<{
  buffered: TimeRanges;
  seekable: TimeRanges;
}>;

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event
 */
export type SeekedEvent = VdsEvent<number> & {
  triggerEvent?: ReplayEvent;
  requestEvent?: SeekRequestEvent;
};

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 */
export type SeekingEvent = VdsEvent<number> & {
  requestEvent?: SeekingRequestEvent;
};

/**
 * Fired when the `currentSrc` property has changed value.
 *
 * @event
 */
export type SrcChangeEvent = VdsEvent<string>;

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 */
export type StalledEvent = VdsEvent<void>;

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 *
 * @event
 */
export type StartedEvent = VdsEvent<void>;

/**
 * Fired when media data loading has been suspended.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 */
export type SuspendEvent = VdsEvent<void>;

/**
 * Fired when media playback starts again after being in an `ended` state.
 *
 * @event
 */
export type ReplayEvent = VdsEvent<void> & {
  requestEvent?: PlayRequestEvent;
  triggerEvent?: LoopedEvent;
};

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 */
export type TimeUpdateEvent = VdsEvent<number>;

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @event
 */
export type ViewTypeChangeEvent = VdsEvent<ViewType>;

export type VolumeChange = {
  muted: boolean;
  volume: number;
};

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 */
export type VolumeChangeEvent = VdsEvent<VolumeChange> & {
  requestEvent?:
    | MuteRequestEvent
    | UnmuteRequestEvent
    | VolumeChangeRequestEvent;
};

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event
 */
export type WaitingEvent = VdsEvent<void>;
