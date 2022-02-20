import { VdsEvent } from '../base/events';
import {
  FullscreenChangeEvent,
  FullscreenErrorEvent,
  FullscreenSupportChange
} from '../base/fullscreen';
import type { MediaErrorDetail } from './MediaError';
import { MediaType } from './MediaType';
import type { MediaProviderElement } from './provider';
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
  'vds-abort': MediaAbortEvent;
  'vds-autoplay-change': MediaAutoplayChangeEvent;
  'vds-autoplay-fail': MediaAutoplayFailEvent;
  'vds-autoplay': MediaAutoplayEvent;
  'vds-can-load': MediaCanLoadEvent;
  'vds-can-play-through': MediaCanPlayThroughEvent;
  'vds-can-play': MediaCanPlayEvent;
  'vds-controls-change': MediaControlsChangeEvent;
  'vds-duration-change': MediaDurationChangeEvent;
  'vds-emptied': MediaEmptiedEvent;
  'vds-end': MediaEndEvent;
  'vds-ended': MediaEndedEvent;
  'vds-error': MediaErrorEvent;
  'vds-fullscreen-change': FullscreenChangeEvent;
  'vds-fullscreen-error': FullscreenErrorEvent;
  'vds-fullscreen-support-change': FullscreenSupportChange;
  'vds-idle-change': MediaIdleChangeEvent;
  'vds-load-start': MediaLoadStartEvent;
  'vds-loaded-data': MediaLoadedDataEvent;
  'vds-loaded-metadata': MediaLoadedMetadataEvent;
  'vds-loop-change': MediaLoopChangeEvent;
  'vds-media-type-change': MediaTypeChangeEvent;
  'vds-pause': MediaPauseEvent;
  'vds-play-fail': MediaPlayFailEvent;
  'vds-play': MediaPlayEvent;
  'vds-playing': MediaPlayingEvent;
  'vds-playsinline-change': MediaPlaysinlineChangeEvent;
  'vds-poster-change': MediaPosterChangeEvent;
  'vds-progress': MediaProgressEvent;
  'vds-replay': MediaReplayEvent;
  'vds-seeked': MediaSeekedEvent;
  'vds-seeking': MediaSeekingEvent;
  'vds-src-change': MediaSrcChangeEvent;
  'vds-stalled': MediaStalledEvent;
  'vds-started': MediaStartedEvent;
  'vds-suspend': MediaSuspendEvent;
  'vds-time-update': MediaTimeUpdateEvent;
  'vds-view-type-change': MediaViewTypeChangeEvent;
  'vds-volume-change': MediaVolumeChangeEvent;
  'vds-waiting': MediaWaitingEvent;
};

export type VdsMediaEvent<DetailType = unknown> = VdsEvent<DetailType> & {
  target: MediaProviderElement;
  requestEvent?: VdsEvent<unknown>;
};

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event
 */
export type MediaAbortEvent = VdsMediaEvent<void>;

/**
 * Fired when the `autoplay` property has changed value.
 *
 * @event
 */
export type MediaAutoplayChangeEvent = VdsMediaEvent<boolean>;

/**
 * Fired when an autoplay attempt has failed. The event detail contains the error that
 * had occurred on the last autoplay attempt which caused it to fail.
 *
 * @event
 */
export type MediaAutoplayFailEvent = VdsMediaEvent<{
  muted: boolean;
  error: Error;
}>;

/**
 * Fired when an autoplay attempt has successfully been made (ie: media playback has automatically
 * started). The event detail whether media is `muted` before any attempts are made.
 *
 * @event
 */
export type MediaAutoplayEvent = VdsMediaEvent<{ muted: boolean }>;

/**
 * Fired when the provider can begin loading media. This depends on the type of `loading`
 * that has been configured. The `eager` strategy will be immediate, and `lazy` once the provider
 * has entered the viewport.
 */
export type MediaCanLoadEvent = VdsMediaEvent<void>;

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
 */
export type MediaCanPlayEvent = VdsMediaEvent<{ duration: number }>;

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
 */
export type MediaCanPlayThroughEvent = VdsMediaEvent<{ duration: number }>;

/**
 * Fired when the `controls` property has changed value.
 *
 * @event
 */
export type MediaControlsChangeEvent = VdsMediaEvent<boolean>;

/**
 * Fired when the `duration` property changes.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event
 */
export type MediaDurationChangeEvent = VdsMediaEvent<number>;

/**
 * Fired when the media has become empty.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event
 */
export type MediaEmptiedEvent = VdsMediaEvent<void>;

/**
 * Fired each time media playback has reached the end. This is fired even if the
 * `loop` property is `true`, which is generally when you'd reach for this event over the
 * `MediaEndedEvent` if you want to be notified of media looping.
 *
 * @event
 */
export type MediaEndEvent = VdsMediaEvent<void>;

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`
 * and `MediaEndEvent`).
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
 */
export type MediaEndedEvent = VdsMediaEvent<void>;

/**
 * Fired when media loading or playback has encountered any issues (for example, a network
 * connectivity problem). The event detail contains a potential message containing more
 * information about the error (empty string if nothing available), and a code that identifies
 * the general type of error that occurred.
 *
 * @event
 * @link https://html.spec.whatwg.org/multipage/media.html#error-codes
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event
 */
export type MediaErrorEvent = VdsMediaEvent<MediaErrorDetail>;

/**
 * Fired when the media idle state changes. Media is idle when playback is progressing (playing),
 * and there is no user activity for a set period of time (default is 2.5s). The event
 * detail contains whether media is idle (`true`), or not (`false`).
 *
 * @event
 */
export type MediaIdleChangeEvent = VdsMediaEvent<boolean> & {
  requestEvent?: ResumeIdlingRequestEvent | PauseIdlingRequestEvent;
};

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event
 */
export type MediaLoadedDataEvent = VdsMediaEvent<void>;

/**
 * Fired when the metadata has been loaded.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event
 */
export type MediaLoadedMetadataEvent = VdsMediaEvent<{
  src: string;
  duration: number;
}>;

/**
 * Fired when the `loop` property has changed value.
 *
 * @event
 */
export type MediaLoopChangeEvent = VdsMediaEvent<boolean>;

/**
 * Fired when the browser has started to load a resource.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event
 */
export type MediaLoadStartEvent = VdsMediaEvent<{
  src: string;
  poster: string;
  mediaType: MediaType;
  viewType: ViewType;
}>;

/**
 * Fired when the `mediaType` property changes value.
 *
 * @event
 */
export type MediaTypeChangeEvent = VdsMediaEvent<MediaType>;

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event
 */
export type MediaPauseEvent = VdsMediaEvent<void> & {
  requestEvent?: PauseRequestEvent;
};

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event
 */
export type MediaPlayEvent = VdsMediaEvent<void> & {
  autoplay?: boolean;
  requestEvent?: PlayRequestEvent;
};

/**
 * Fired when an attempt to start media playback results in an error.
 */
export type MediaPlayFailEvent = VdsMediaEvent<void> & {
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
export type MediaPlayingEvent = VdsMediaEvent<void>;

/**
 * Fired when the `playsinline` property has changed value.
 *
 * @event
 */
export type MediaPlaysinlineChangeEvent = VdsMediaEvent<boolean>;

/**
 * Fired when the `currentPoster` property has changed value.
 *
 * @event
 */
export type MediaPosterChangeEvent = VdsMediaEvent<string>;

/**
 * Fired periodically as the browser loads a resource.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event
 */
export type MediaProgressEvent = VdsMediaEvent<{
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
export type MediaSeekedEvent = VdsMediaEvent<number> & {
  requestEvent?: SeekRequestEvent;
};

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event
 */
export type MediaSeekingEvent = VdsMediaEvent<number> & {
  requestEvent?: SeekingRequestEvent;
};

/**
 * Fired when the `currentSrc` property has changed value.
 *
 * @event
 */
export type MediaSrcChangeEvent = VdsMediaEvent<string>;

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event
 */
export type MediaStalledEvent = VdsMediaEvent<void>;

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 *
 * @event
 */
export type MediaStartedEvent = VdsMediaEvent<void>;

/**
 * Fired when media data loading has been suspended.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event
 */
export type MediaSuspendEvent = VdsMediaEvent<void>;

/**
 * Fired when media playback starts again after being in an `ended` state. This is fired
 * when the `loop` property is `true` and media loops, whereas the `vds-play` event is not.
 *
 * @event
 */
export type MediaReplayEvent = VdsMediaEvent<void> & {
  requestEvent?: PlayRequestEvent;
};

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 */
export type MediaTimeUpdateEvent = VdsMediaEvent<number>;

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @event
 */
export type MediaViewTypeChangeEvent = VdsMediaEvent<ViewType>;

export type MediaVolumeChange = {
  muted: boolean;
  volume: number;
};

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @event
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
 */
export type MediaVolumeChangeEvent = VdsMediaEvent<MediaVolumeChange> & {
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
export type MediaWaitingEvent = VdsMediaEvent<void>;
