import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationChangeEvent } from '../../foundation/orientation/events';
import type { MediaPlayerElement } from '../element/types';
import type {
  AddAudioTrackEvent,
  AudioTrack,
  ChangeAudioTrackEvent,
  RemoveAudioTrackEvent,
} from './audio-tracks';
import type { MediaProvider, MediaProviderLoader } from './providers/types';
import type * as RE from './request-events';
import type {
  MediaErrorDetail,
  MediaSrc,
  MediaStreamType,
  MediaType,
  MediaViewType,
} from './types';
import type {
  AddVideoQualityEvent,
  ChangeVideoQualityEvent,
  RemoveVideoQualityEvent,
  VideoQuality,
} from './video-quality';

export interface MediaEvents {
  'audio-tracks-change': MediaAudioTracksChangeEvent;
  'audio-track-change': MediaAudioTrackChangeEvent;
  'autoplay-change': MediaAutoplayChangeEvent;
  'autoplay-fail': MediaAutoplayFailEvent;
  'can-load': MediaCanLoadEvent;
  'can-play-through': MediaCanPlayThroughEvent;
  'can-play': MediaCanPlayEvent;
  'controls-change': MediaControlsChangeEvent;
  'duration-change': MediaDurationChangeEvent;
  'fullscreen-change': MediaFullscreenChangeEvent;
  'fullscreen-error': MediaFullscreenErrorEvent;
  'live-change': MediaLiveChangeEvent;
  'live-edge-change': MediaLiveEdgeChangeEvent;
  'load-start': MediaLoadStartEvent;
  'loaded-data': MediaLoadedDataEvent;
  'loaded-metadata': MediaLoadedMetadataEvent;
  'loop-change': MediaLoopChangeEvent;
  'media-type-change': MediaTypeChangeEvent;
  'orientation-change': MediaOrientationChangeEvent;
  'play-fail': MediaPlayFailEvent;
  'playsinline-change': MediaPlaysinlineChangeEvent;
  'poster-change': MediaPosterChangeEvent;
  'provider-change': MediaProviderChangeEvent;
  'provider-loader-change': MediaProviderLoaderChangeEvent;
  'provider-setup': MediaProviderSetupEvent;
  'picture-in-picture-change': MediaPIPChangeEvent;
  'picture-in-picture-error': MediaPIPErrorEvent;
  'qualities-change': MediaQualitiesChangeEvent;
  'quality-change': MediaQualityChangeEvent;
  'rate-change': MediaRateChangeEvent;
  'source-change': MediaSourceChangeEvent;
  'sources-change': MediaSourcesChangeEvent;
  'time-update': MediaTimeUpdateEvent;
  'user-idle-change': UserIdleChangeEvent;
  'stream-type-change': MediaStreamTypeChangeEvent;
  'view-type-change': MediaViewTypeChangeEvent;
  'volume-change': MediaVolumeChangeEvent;
  abort: MediaAbortEvent;
  autoplay: MediaAutoplayEvent;
  destroy: MediaDestroyEvent;
  emptied: MediaEmptiedEvent;
  end: MediaEndEvent;
  ended: MediaEndedEvent;
  error: MediaErrorEvent;
  pause: MediaPauseEvent;
  play: MediaPlayEvent;
  playing: MediaPlayingEvent;
  progress: MediaProgressEvent;
  replay: MediaReplayEvent;
  seeked: MediaSeekedEvent;
  seeking: MediaSeekingEvent;
  stalled: MediaStalledEvent;
  started: MediaStartedEvent;
  suspend: MediaSuspendEvent;
  waiting: MediaWaitingEvent;
}

export interface MediaEvent<Detail = unknown> extends DOMEvent<Detail> {
  target: MediaPlayerElement;
  request?: DOMEvent<any>;
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event}
 */
export interface MediaAbortEvent extends MediaEvent<void> {}

/**
 * Fired when an audio track has been added or removed.
 */
export interface MediaAudioTracksChangeEvent extends MediaEvent<AudioTrack[]> {
  trigger: AddAudioTrackEvent | RemoveAudioTrackEvent;
}

/**
 * Fired when the current audio track changes.
 */
export interface MediaAudioTrackChangeEvent extends MediaEvent<AudioTrack | null> {
  trigger: ChangeAudioTrackEvent;
  request?: RE.MediaAudioTrackChangeRequestEvent;
}

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
export interface MediaCanPlayEvent extends MediaEvent<MediaCanPlayDetail> {}

export interface MediaCanPlayDetail {
  duration: number;
  buffered: TimeRanges;
  seekable: TimeRanges;
}

/**
 * Fired when the user agent can play the media, and estimates that **enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event}
 */
export interface MediaCanPlayThroughEvent extends MediaEvent<MediaCanPlayDetail> {}

/**
 * Fired when the `controls` property has changed value.
 */
export interface MediaControlsChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the playback rate has changed. The event `detail` contains the new rate.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event}
 */
export interface MediaRateChangeEvent extends MediaEvent<number> {
  request?: RE.MediaRateChangeRequestEvent;
}

/**
 * Fired when the `source` property has changed value.
 */
export interface MediaSourceChangeEvent extends MediaEvent<MediaSrc> {}

/**
 * Fired when the player is manually destroyed by calling the `destroy()` method.
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
 * Fired when media enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @bubbles
 * @composed
 */
export interface MediaFullscreenChangeEvent extends MediaEvent<boolean> {
  request?: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
}

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if fullscreen is not supported or the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 */
export interface MediaFullscreenErrorEvent extends MediaEvent<unknown> {
  request?: RE.MediaEnterFullscreenRequestEvent | RE.MediaExitFullscreenRequestEvent;
}

/**
 * Fired when the user idle state changes. The user is idle when playback is progressing (playing),
 * and there is no user activity for a set period of time (default is 2.5s). The event
 * detail contains whether the user is idle (`true`), or not (`false`).
 */
export interface UserIdleChangeEvent extends MediaEvent<boolean> {
  request?: RE.MediaResumeUserIdleRequestEvent | RE.MediaPauseUserIdleRequestEvent;
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
 * Fired when the `live` state changes. The event detail indicates whether the current stream
 * is live or not.
 */
export interface MediaLiveChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `liveEdge` state changes. The event detail indicates whether the user is viewing
 * at the live edge or not.
 */
export interface MediaLiveEdgeChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the browser has started to load a resource.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event}
 */
export interface MediaLoadStartEvent extends MediaEvent<void> {}

/**
 * Fired when the `media` property changes value.
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
  request?: RE.MediaPauseRequestEvent;
}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoplay` attribute.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event}
 */
export interface MediaPlayEvent extends MediaEvent<void> {
  autoplay?: boolean;
  request?: RE.MediaPlayRequestEvent;
}

/**
 * Fired when an attempt to start media playback results in an error.
 */
export interface MediaPlayFailEvent extends MediaEvent<Error> {
  autoplay?: boolean;
  request?: RE.MediaPlayRequestEvent;
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
 * Fired when the new media provider loader has been selected and rendered. This will be `null` if
 * no loader is able to play one of the current sources.
 */
export interface MediaProviderLoaderChangeEvent extends MediaEvent<MediaProviderLoader | null> {}

/**
 * Fired when the new media provider has been selected. This will be `null` if no provider is
 * able to play one of the current sources.
 *
 * This event is ideal for initially configuring any provider-specific settings.
 */
export interface MediaProviderChangeEvent extends MediaEvent<MediaProvider | null> {}

/**
 * Fired immediately after the provider has been set up. Do not try and configure the provider
 * here as it'll be too late - prefer the `provider-change` event.
 */
export interface MediaProviderSetupEvent extends MediaEvent<MediaProvider> {}

/**
 * Fired when media enters/exits picture-in-picture (PIP) mode. The event detail is a `boolean`
 * indicating if PIP was entered (`true`) or exited (`false`).
 *
 * @bubbles
 * @composed
 */
export interface MediaPIPChangeEvent extends MediaEvent<boolean> {
  request?: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
}

/**
 * Fired when an error occurs either entering or exiting picture-in-picture (PIP) mode. This will
 * generally occur if PIP is not supported or the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 */
export interface MediaPIPErrorEvent extends MediaEvent<unknown> {
  request?: RE.MediaEnterPIPRequestEvent | RE.MediaExitPIPRequestEvent;
}

/**
 * Fired when the list of available video qualities/renditions has changed.
 */
export interface MediaQualitiesChangeEvent extends MediaEvent<VideoQuality[]> {
  trigger: AddVideoQualityEvent | RemoveVideoQualityEvent;
}

/**
 * Fired when the current video quality/rendition has changed. The event detail will be null if
 * video quality information is not available.
 */
export interface MediaQualityChangeEvent extends MediaEvent<VideoQuality | null> {
  trigger: ChangeVideoQualityEvent;
  request?: RE.MediaQualityChangeRequestEvent;
}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event}
 */
export interface MediaSeekedEvent extends MediaEvent<number> {
  request?: RE.MediaSeekRequestEvent;
}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event}
 */
export interface MediaSeekingEvent extends MediaEvent<number> {
  request?: RE.MediaSeekingRequestEvent;
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
 * Fired when a screen orientation change is requested on or by the media.
 */
export interface MediaOrientationChangeEvent extends ScreenOrientationChangeEvent {}

/**
 * Fired when media playback starts again after being in an `ended` state. This is fired
 * when the `loop` property is `true` and media loops, whereas the `play` event is not.
 */
export interface MediaReplayEvent extends MediaEvent<void> {
  request?: RE.MediaPlayRequestEvent;
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
 * Fired when the `streamType` property changes value. The event detail contains the type of
 * stream (e.g., `on-demand`, `live`, `live:dvr`, etc.).
 */
export interface MediaStreamTypeChangeEvent extends MediaEvent<MediaStreamType> {}

/**
 * Fired when the `viewType` property changes value. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 */
export interface MediaViewTypeChangeEvent extends MediaEvent<MediaViewType> {}

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
  request?:
    | RE.MediaMuteRequestEvent
    | RE.MediaUnmuteRequestEvent
    | RE.MediaVolumeChangeRequestEvent;
}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event}
 */
export interface MediaWaitingEvent extends MediaEvent<void> {}
