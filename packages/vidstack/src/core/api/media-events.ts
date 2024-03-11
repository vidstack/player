import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components';
import type { ScreenOrientationChangeEvent } from '../../foundation/orientation/events';
import type { MediaProviderAdapter, MediaProviderLoader } from '../../providers/types';
import type { VideoQuality } from '../quality/video-quality';
import type { AudioTrack } from '../tracks/audio-tracks';
import type { TextTrack } from '../tracks/text/text-track';
import type { Src } from './src-types';
import type {
  MediaErrorDetail,
  MediaStreamType,
  MediaType,
  MediaViewType,
  RemotePlaybackType,
} from './types';

export interface MediaEvents {
  'audio-tracks-change': MediaAudioTracksChangeEvent;
  'audio-track-change': MediaAudioTrackChangeEvent;
  'audio-gain-change': MediaAudioGainChangeEvent;
  'auto-play-change': MediaAutoPlayChangeEvent;
  'auto-play-fail': MediaAutoPlayFailEvent;
  'can-load': MediaCanLoadEvent;
  'can-load-poster': MediaCanLoadPosterEvent;
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
  'plays-inline-change': MediaPlaysInlineChangeEvent;
  'poster-change': MediaPosterChangeEvent;
  'provider-change': MediaProviderChangeEvent;
  'provider-loader-change': MediaProviderLoaderChangeEvent;
  'provider-setup': MediaProviderSetupEvent;
  'picture-in-picture-change': MediaPIPChangeEvent;
  'picture-in-picture-error': MediaPIPErrorEvent;
  'qualities-change': MediaQualitiesChangeEvent;
  'quality-change': MediaQualityChangeEvent;
  'rate-change': MediaRateChangeEvent;
  'remote-playback-change': MediaRemotePlaybackChangeEvent;
  'source-change': MediaSourceChangeEvent;
  'sources-change': MediaSourcesChangeEvent;
  'time-update': MediaTimeUpdateEvent;
  'title-change': MediaTitleChangeEvent;
  'stream-type-change': MediaStreamTypeChangeEvent;
  'text-tracks-change': MediaTextTracksChangeEvent;
  'text-track-change': MediaTextTrackChangeEvent;
  'view-type-change': MediaViewTypeChangeEvent;
  'volume-change': MediaVolumeChangeEvent;
  abort: MediaAbortEvent;
  'auto-play': MediaAutoPlayEvent;
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
  target: MediaPlayer;
  request?: Event;
}

/**
 * Fired when the resource was not fully loaded, but not as the result of an error.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event}
 */
export interface MediaAbortEvent extends MediaEvent<void> {}

/**
 * Fired when an audio track has been added or removed.
 *
 * @detail audioTrack
 */
export interface MediaAudioTracksChangeEvent extends MediaEvent<AudioTrack[]> {}

/**
 * Fired when the current audio track changes.
 *
 * @detail audioTrack
 */
export interface MediaAudioTrackChangeEvent extends MediaEvent<AudioTrack | null> {}

/**
 * Fired when the `autoPlay` property has changed value.
 *
 * @detail shouldAutoPlay
 */
export interface MediaAutoPlayChangeEvent extends MediaEvent<boolean> {}

export interface MediaAutoPlayFailEventDetail {
  muted: boolean;
  error: Error;
}

/**
 * Fired when an auto-play attempt has failed. The event detail contains the error that
 * had occurred on the last auto-play attempt which caused it to fail.
 */
export interface MediaAutoPlayFailEvent extends MediaEvent<MediaAutoPlayFailEventDetail> {}

export interface MediaAutoPlayEventDetail {
  muted: boolean;
}

/**
 * Fired when an auto-play attempt has successfully been made (ie: media playback has automatically
 * started). The event detail whether media is `muted` before any attempts are made.
 */
export interface MediaAutoPlayEvent extends MediaEvent<MediaAutoPlayEventDetail> {}

/**
 * Fired when the player can begin loading the current provider and media. This depends on the
 * `load` player prop.
 *
 *  @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
 */
export interface MediaCanLoadEvent extends MediaEvent<void> {}

/**
 * Fired when the player can begin loading the poster image. This depends on the `posterLoad`
 * player prop.
 *
 *  @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
 */
export interface MediaCanLoadPosterEvent extends MediaEvent<void> {}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event}
 */
export interface MediaCanPlayEvent extends MediaEvent<MediaCanPlayDetail> {}

export interface MediaCanPlayDetail {
  provider: MediaProviderAdapter;
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
 * Fired when controls visibility changes. The controls are idle/hidden when playback is
 * progressing (playing), and there is no user activity for a set period of time
 * (default is 2.5s). The event detail contains whether the controls are visible or not.
 *
 * @detail isVisible
 */
export interface MediaControlsChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the playback rate has changed. The event `detail` contains the new rate.
 *
 * @detail rate
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event}
 */
export interface MediaRateChangeEvent extends MediaEvent<number> {}

/**
 * Fired when the audio gain has changed. The event `detail` contains the new gain.
 *
 * @detail gain
 */
export interface MediaAudioGainChangeEvent extends MediaEvent<number | null> {}

export interface MediaRemotePlaybackChangeEventDetail {
  type: RemotePlaybackType;
  state: RemotePlaybackState;
}

/**
 * Fired when the remote playback state (`connecting`, `connected`, `disconnected`) and type
 * (`airplay`, `google-cast`) has changed.
 */
export interface MediaRemotePlaybackChangeEvent
  extends MediaEvent<MediaRemotePlaybackChangeEventDetail> {}

/**
 * Fired when the `source` property has changed value.
 *
 * @detail src
 */
export interface MediaSourceChangeEvent extends MediaEvent<Src> {
  /** Whether this source change was due to a quality change. */
  isQualityChange?: boolean;
}

/**
 * Fired when the player is manually destroyed by calling the `destroy()` method.
 */
export interface MediaDestroyEvent extends MediaEvent<void> {}

/**
 * Fired when the `duration` property changes.
 *
 * @detail duration
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
 * @detail isFullscreen
 */
export interface MediaFullscreenChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if fullscreen is not supported or the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 * @detail error
 */
export interface MediaFullscreenErrorEvent extends MediaEvent<unknown> {}

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
 *
 * @detail isLooping
 */
export interface MediaLoopChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `live` state changes. The event detail indicates whether the current stream
 * is live or not.
 *
 * @detail isLive
 */
export interface MediaLiveChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `liveEdge` state changes. The event detail indicates whether the user is viewing
 * at the live edge or not.
 *
 * @detail isLiveEdge
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
 *
 * @detail mediaType
 */
export interface MediaTypeChangeEvent extends MediaEvent<MediaType> {}

/**
 * Fired when a request to `pause` an activity is handled and the activity has entered its
 * `paused` state, most commonly after the media has been paused through a call to the
 * `pause()` method.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event}
 */
export interface MediaPauseEvent extends MediaEvent<void> {}

/**
 * Fired when the `paused` property is changed from `true` to `false`, as a result of the `play()`
 * method, or the `autoPlay` property.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event}
 */
export interface MediaPlayEvent extends MediaEvent<void> {
  autoPlay?: boolean;
}

/**
 * Fired when an attempt to start media playback results in an error.
 *
 * @detail error
 */
export interface MediaPlayFailEvent extends MediaEvent<Error> {
  autoPlay?: boolean;
}

/**
 * Fired when playback is ready to start after having been paused or delayed due to lack of data.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event}
 */
export interface MediaPlayingEvent extends MediaEvent<void> {}

/**
 * Fired when the `playsInline` property has changed value.
 *
 * @detail isInline
 */
export interface MediaPlaysInlineChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when the `currentPoster` property has changed value.
 *
 * @detail poster
 */
export interface MediaPosterChangeEvent extends MediaEvent<string> {}

export interface MediaProgressEventDetail {
  buffered: TimeRanges;
  seekable: TimeRanges;
}

/**
 * Fired periodically as the browser loads a resource.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event}
 * @detail progress
 */
export interface MediaProgressEvent extends MediaEvent<MediaProgressEventDetail> {}

/**
 * Fired when the new media provider loader has been selected and rendered. This will be `null` if
 * no loader is able to play one of the current sources.
 *
 * @detail loader
 */
export interface MediaProviderLoaderChangeEvent extends MediaEvent<MediaProviderLoader | null> {}

/**
 * Fired when the new media provider has been selected. This will be `null` if no provider is
 * able to play one of the current sources.
 *
 * This event is ideal for initially configuring any provider-specific settings.
 *
 * @detail adapter
 */
export interface MediaProviderChangeEvent extends MediaEvent<MediaProviderAdapter | null> {}

/**
 * Fired immediately after the provider has been set up. Do not try and configure the provider
 * here as it'll be too late - prefer the `provider-change` event.
 *
 * @detail adapter
 */
export interface MediaProviderSetupEvent extends MediaEvent<MediaProviderAdapter> {}

/**
 * Fired when media enters/exits picture-in-picture (PIP) mode. The event detail is a `boolean`
 * indicating if PIP was entered (`true`) or exited (`false`).
 *
 * @bubbles
 * @composed
 * @detail isPictureInPictureMode
 */
export interface MediaPIPChangeEvent extends MediaEvent<boolean> {}

/**
 * Fired when an error occurs either entering or exiting picture-in-picture (PIP) mode. This will
 * generally occur if PIP is not supported or the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 * @detail error
 */
export interface MediaPIPErrorEvent extends MediaEvent<unknown> {}

/**
 * Fired when the list of available video qualities/renditions has changed.
 *
 * @detail renditions
 */
export interface MediaQualitiesChangeEvent extends MediaEvent<VideoQuality[]> {}

/**
 * Fired when the current video quality/rendition has changed. The event detail will be null if
 * video quality information is not available.
 *
 * @detail quality
 */
export interface MediaQualityChangeEvent extends MediaEvent<VideoQuality | null> {}

/**
 * Fired when a seek operation completed, the current playback position has changed, and the
 * `seeking` property is changed to `false`.
 *
 * @detail currentTime
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event}
 */
export interface MediaSeekedEvent extends MediaEvent<number> {}

/**
 * Fired when a seek operation starts, meaning the seeking property has changed to `true` and the
 * media is seeking to a new position.
 *
 * @detail currentTime
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event}
 */
export interface MediaSeekingEvent extends MediaEvent<number> {}

/**
 * Fired when the current media sources has changed.
 *
 * @detail src
 */
export interface MediaSourcesChangeEvent extends MediaEvent<Src[]> {}

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
export interface MediaReplayEvent extends MediaEvent<void> {}

export interface MediaTimeUpdateEventDetail {
  currentTime: number;
  played: TimeRanges;
}

/**
 * Fired when the `currentTime` property value changes due to media playback or the
 * user seeking.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event}
 */
export interface MediaTimeUpdateEvent extends MediaEvent<MediaTimeUpdateEventDetail> {}

/**
 * Fired when the provided or inferred media title has changed.
 *
 * @detail title
 */
export interface MediaTitleChangeEvent extends MediaEvent<string> {}

/**
 * Fired when the `streamType` property changes value. The event detail contains the type of
 * stream (e.g., `on-demand`, `live`, `live:dvr`, etc.).
 *
 * @detail streamType
 */
export interface MediaStreamTypeChangeEvent extends MediaEvent<MediaStreamType> {}

/**
 * Fired when an audio track has been added or removed.
 *
 * @detail textTracks
 */
export interface MediaTextTracksChangeEvent extends MediaEvent<TextTrack[]> {}

/**
 * Fired when the current captions/subtitles text track changes.
 *
 * @detail textTrack
 */
export interface MediaTextTrackChangeEvent extends MediaEvent<TextTrack | null> {}

/**
 * Fired when the `viewType` property changes value. This will generally fire when the
 * new provider has mounted and determined what type of player view is appropriate given
 * the type of media it can play.
 *
 * @detail viewType
 */
export interface MediaViewTypeChangeEvent extends MediaEvent<MediaViewType> {}

export interface MediaVolumeChange {
  muted: boolean;
  volume: number;
}

/**
 * Fired when the `volume` or `muted` properties change value.
 *
 * @detail volume
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event}
 */
export interface MediaVolumeChangeEvent extends MediaEvent<MediaVolumeChange> {}

/**
 * Fired when playback has stopped because of a temporary lack of data.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event}
 */
export interface MediaWaitingEvent extends MediaEvent<void> {}
