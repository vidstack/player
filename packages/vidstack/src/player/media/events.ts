import type { DOMEvent } from 'maverick.js/std';

import type {
  FullscreenChangeEvent,
  FullscreenErrorEvent,
  FullscreenSupportChange,
} from '../../foundation/fullscreen/events';
import type {
  ScreenOrientationChangeEvent,
  ScreenOrientationLockChangeEvent,
} from '../../foundation/orientation/events';
import type { MediaProviderElement } from './provider/types';
import type {
  MuteRequestEvent,
  PauseRequestEvent,
  PauseUserIdleRequestEvent,
  PlayRequestEvent,
  ResumeUserIdleRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent,
} from './request-events';
import type { MediaErrorDetail, MediaSrc, MediaType, ViewType } from './types';

export interface MediaEvents {
  'vds-abort': MediaAbortEvent;
  'vds-autoplay-change': MediaAutoplayChangeEvent;
  'vds-autoplay-fail': MediaAutoplayFailEvent;
  'vds-autoplay': MediaAutoplayEvent;
  'vds-can-load': MediaCanLoadEvent;
  'vds-can-play-through': MediaCanPlayThroughEvent;
  'vds-can-play': MediaCanPlayEvent;
  'vds-controls-change': MediaControlsChangeEvent;
  'vds-destroy': MediaDestroyEvent;
  'vds-duration-change': MediaDurationChangeEvent;
  'vds-emptied': MediaEmptiedEvent;
  'vds-end': MediaEndEvent;
  'vds-ended': MediaEndedEvent;
  'vds-error': MediaErrorEvent;
  'vds-fullscreen-change': FullscreenChangeEvent;
  'vds-fullscreen-error': FullscreenErrorEvent;
  'vds-fullscreen-support-change': FullscreenSupportChange;
  'vds-user-idle-change': UserIdleChangeEvent;
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
  'vds-source-change': MediaSourceChangeEvent;
  'vds-sources-change': MediaSourcesChangeEvent;
  'vds-stalled': MediaStalledEvent;
  'vds-started': MediaStartedEvent;
  'vds-suspend': MediaSuspendEvent;
  'vds-screen-orientation-change': ScreenOrientationChangeEvent;
  'vds-screen-orientation-lock-change': ScreenOrientationLockChangeEvent;
  'vds-time-update': MediaTimeUpdateEvent;
  'vds-view-type-change': MediaViewTypeChangeEvent;
  'vds-volume-change': MediaVolumeChangeEvent;
  'vds-waiting': MediaWaitingEvent;
}

export interface MediaEvent<Detail = unknown> extends DOMEvent<Detail> {
  target: MediaProviderElement;
  requestEvent?: DOMEvent<any>;
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event}
 */
export interface MediaAbortEvent extends MediaEvent<void> {}

/**
 * Fired when the `autoplay` property has changed value.
 */
export interface MediaAutoplayChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when an autoplay attempt has failed. The event detail contains the error that
 * had occurred on the last autoplay attempt which caused it to fail.
 */
export interface MediaAutoplayFailEvent
  extends MediaEvent<{
    muted: boolean;
    error: Error;
  }> {}

/**
 * Fired when an autoplay attempt has successfully been made (ie: media playback has automatically
 * started). The event detail whether media is `muted` before any attempts are made.
 */
export interface MediaAutoplayEvent extends MediaEvent<{ muted: boolean }> {}

/**
 * Fired when the provider can begin loading media. This depends on the type of `loading`
 * that has been configured. The `eager` strategy will be immediate, and `lazy` once the provider
 * has entered the viewport.
 */
export interface MediaCanLoadEvent extends MediaEvent<void> {}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event}
 */
export interface MediaCanPlayEvent extends MediaEvent<{ duration: number }> {}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event}
 */
export interface MediaCanPlayThroughEvent extends MediaEvent<{ duration: number }> {}

/**
 * Fired when the `controls` property has changed value.
 */
export interface MediaControlsChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `source` property has changed value.
 */
export interface MediaSourceChangeEvent extends MediaEvent<MediaSrc> {}

/**
 * Fired when the media provider element is manually destroyed by calling the `destroy()` method.
 */
export interface MediaDestroyEvent extends MediaEvent<void> {}

/**
 * Fired when the `duration` property changes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event}
 */
export interface MediaDurationChangeEvent extends MediaEvent<number> {}

/**
 * Fired when the media has become empty.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event}
 */
export interface MediaEmptiedEvent extends MediaEvent<void> {}

/**
 * Fired each time media playback has reached the end. This is fired even if the
 * `loop` property is `true`, which is generally when you'd reach for this event over the
 * `MediaEndedEvent` if you want to be notified of media looping.
 */
export interface MediaEndEvent extends MediaEvent<void> {}

/**
 * Fired when playback or streaming has stopped because the end of the media was reached or
 * because no further data is available. This is not fired if playback will start from the
 * beginning again due to the `loop` property being `true` (see `MediaReplayEvent`
 * and `MediaEndEvent`).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event}
 */
export interface MediaEndedEvent extends MediaEvent<void> {}

/**
 * Fired when media loading or playback has encountered any issues (for example, a network
 * connectivity problem). The event detail contains a potential message containing more
 * information about the error (empty string if nothing available), and a code that identifies
 * the general type of error that occurred.
 *
 * @see {@link https://html.spec.whatwg.org/multipage/media.html#error-codes}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event}
 */
export interface MediaErrorEvent extends MediaEvent<MediaErrorDetail> {}

/**
 * Fired when the user idle state changes. The user is idle when playback is progressing (playing),
 * and there is no user activity for a set period of time (default is 2.5s). The event
 * detail contains whether the user is idle (`true`), or not (`false`).
 */
export interface UserIdleChangeEvent extends MediaEvent<boolean> {
  requestEvent?: ResumeUserIdleRequestEvent | PauseUserIdleRequestEvent;
}

/**
 * Fired when the frame at the current playback position of the media has finished loading; often
 * the first frame.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event}
 */
export interface MediaLoadedDataEvent extends MediaEvent<void> {}

/**
 * Fired when the metadata has been loaded.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event}
 */
export interface MediaLoadedMetadataEvent extends MediaEvent<void> {}

/**
 * Fired when the `loop` property has changed value.
 */
export interface MediaLoopChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the browser has started to load a resource.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event}
 */
export interface MediaLoadStartEvent extends MediaEvent<void> {}

/**
 * Fired when the `mediaType` property changes value.
 */
export interface MediaTypeChangeEvent extends MediaEvent<MediaType> {}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event}
 */
export interface MediaPauseEvent extends MediaEvent<void> {
  requestEvent?: PauseRequestEvent;
}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event}
 */
export interface MediaPlayEvent extends MediaEvent<void> {
  autoplay?: boolean;
  requestEvent?: PlayRequestEvent;
}

/**
 * Fired when an attempt to start media playback results in an error.
 */
export interface MediaPlayFailEvent extends MediaEvent<void> {
  autoplay?: boolean;
  error?: Error;
  requestEvent?: PlayRequestEvent;
}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event}
 */
export interface MediaPlayingEvent extends MediaEvent<void> {}

/**
 * Fired when the `playsinline` property has changed value.
 */
export interface MediaPlaysinlineChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `currentPoster` property has changed value.
 */
export interface MediaPosterChangeEvent extends MediaEvent<string> {}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event}
 */
export interface MediaProgressEvent
  extends MediaEvent<{
    buffered: TimeRanges;
    seekable: TimeRanges;
  }> {}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event}
 */
export interface MediaSeekedEvent extends MediaEvent<number> {
  requestEvent?: SeekRequestEvent;
}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event}
 */
export interface MediaSeekingEvent extends MediaEvent<number> {
  requestEvent?: SeekingRequestEvent;
}

/**
 * Fired when the current media sources has changed.
 */
export interface MediaSourcesChangeEvent extends MediaEvent<MediaSrc[]> {}

/**
 * Fired when the user agent is trying to fetch media data, but data is unexpectedly not
 * forthcoming.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event}
 */
export interface MediaStalledEvent extends MediaEvent<void> {}

/**
 * Fired when media playback has just started, in other words the at the moment the following
 * happens: `currentTime > 0`.
 */
export interface MediaStartedEvent extends MediaEvent<void> {}

/**
 * Fired when media data loading has been suspended.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event}
 */
export interface MediaSuspendEvent extends MediaEvent<void> {}

/**
 * Fired when media playback starts again after being in an `ended` state. This is fired
 * when the `loop` property is `true` and media loops, whereas the `vds-play` event is not.
 */
export interface MediaReplayEvent extends MediaEvent<void> {
  requestEvent?: PlayRequestEvent;
}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event}
 */
export interface MediaTimeUpdateEvent
  extends MediaEvent<{
    currentTime: number;
    played: TimeRanges;
  }> {}

/**
 * Fired when the `viewType` property changes `value`. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 */
export interface MediaViewTypeChangeEvent extends MediaEvent<ViewType> {}

export interface MediaVolumeChange {
  muted: boolean;
  volume: number;
}

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event}
 */
export interface MediaVolumeChangeEvent extends MediaEvent<MediaVolumeChange> {
  requestEvent?: MuteRequestEvent | UnmuteRequestEvent | VolumeChangeRequestEvent;
}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event}
 */
export interface MediaWaitingEvent extends MediaEvent<void> {}
