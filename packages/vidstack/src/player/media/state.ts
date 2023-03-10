import type { LogLevel } from '../../foundation/logger/log-level';
import type { AudioTrack } from './audio-tracks';
import type {
  MediaErrorDetail,
  MediaSrc,
  MediaStreamType,
  MediaType,
  MediaViewType,
} from './types';
import type { VideoQuality } from './video-quality';

export interface MediaState {
  /**
   * Whether playback should automatically begin as soon as enough media is available to do so
   * without interruption.
   *
   * Sites which automatically play audio (or videos with an audio track) can be an unpleasant
   * experience for users, so it should be avoided when possible. If you must offer autoplay
   * functionality, you should make it opt-in (requiring a user to specifically enable it).
   *
   * However, autoplay can be useful when creating media elements whose source will be set at a
   * later time, under user control.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay}
   */
  autoplay: boolean;
  /**
   * Set to an error when autoplay has failed to begin playback. This can be used to determine
   * when to show a recovery UI in the event autoplay fails.
   *
   * @defaultValue undefined
   */
  autoplayError: { muted: boolean; error: Error } | undefined;
  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source that the
   * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
   * contiguous but if the user jumps about while media is buffering, it may contain holes.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered}
   * @defaultValue TimeRanges
   */
  buffered: TimeRanges;
  /**
   * The earliest time in seconds for which media has been buffered (i.e., downloaded by the
   * browser).
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered}
   */
  readonly bufferedStart: number;
  /**
   * The latest time in seconds for which media has been buffered (i.e., downloaded by the
   * browser).
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered}
   */
  readonly bufferedEnd: number;
  /**
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `0`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration}
   */
  duration: number;
  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  canFullscreen: boolean;
  /**
   * Whether picture-in-picture mode is supported by the current media provider.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API}
   */
  canPictureInPicture: boolean;
  /**
   * Whether media is allowed to begin loading. This depends on the `loading` configuration.
   * If `eager`, `canLoad` will be `true` immediately, and if `lazy` this will become `true`
   * once the media has entered the viewport.
   */
  canLoad: boolean;
  /**
   * Whether the user agent can play the media, but estimates that **not enough** data has been
   * loaded to play the media up to its end without having to stop for further buffering of
   * content.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event}
   */
  canPlay: boolean;
  /**
   * Whether seeking operations are possible on the current stream. This generally false for
   * live streams that are loaded natively.
   *
   * @defaultValue true
   */
  readonly canSeek: boolean;
  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls}
   */
  controls: boolean;
  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   *
   * @defaultValue ''
   */
  poster: string;
  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime}
   */
  currentTime: number;
  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended}
   */
  ended: boolean;
  /**
   * Contains the most recent media error or undefined if there's been none. You can listen for
   * `error` event updates and examine this object to debug further.
   *
   * @defaultValue undefined
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error}
   */
  error: MediaErrorDetail | undefined;
  /**
   * Whether the player is currently in fullscreen mode.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  fullscreen: boolean;
  /**
   * Whether the user is idle. This will occur when media playback is progressing (playing)
   * without any detected user activity for a set period of time (default is 2.5s). This means as
   * long as media is paused, `userIdle` will be `false`.
   *
   * @defaultValue false
   */
  userIdle: boolean;
  /**
   * Whether the user has intentionally seeked behind the live edge. The user must've seeked
   * roughly 2 or more seconds behind during a live stream for this to be considered true.
   *
   * @defaultValue false
   */
  userBehindLiveEdge: boolean;
  /**
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop}
   */
  loop: boolean;
  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  logLevel: LogLevel;
  /**
   * Whether the current media stream is live (i.e., being broadcast right now).
   */
  live: boolean;
  /**
   * The number of seconds that `currentTime` can be behind `liveEdgeStart` and still be considered
   * at the edge. The default value is 10, meaning the user can be up to 10 seconds behind the
   * live edge start and still be considered live.
   *
   * @defaultValue 10
   */
  liveEdgeTolerance: number;
  /**
   * The minimum seekable length in seconds before seeking operations are permitted.
   *
   * @defaultValue 30
   */
  minLiveDVRWindow: number;
  /**
   * Whether the current stream is at the live edge. This is true if:
   *
   * 1. The player is _not_ in a paused state.
   * 2. The user has _not_ intentionally seeked behind live edge start.
   * 3. The `currentTime` is greater or equal than `liveEdgeStart`.
   *
   * This value will default to `false` for non-live streams.
   *
   * @defaultValue false
   */
  readonly liveEdge: boolean;
  /**
   * This is the starting edge of the live stream.
   *
   * A delay is applied in `hls.js` that's specified by the `liveSyncDurationCount` which is
   * expressed as a multiple of `EXT-X-TARGETDURATION` (default value is safely set to 3). If
   * set to `m`, playback will start from the fragment at `n-m`, where `n` is the last fragment
   * of the live playlist. Decreasing this value is likely to cause playback stalls.
   *
   * The `seekableEnd` value is used as the live edge start in native playback engines.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlslivesyncposition}
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#livesyncdurationcount}
   * @see {@link https://github.com/video-dev/media-ui-extensions/blob/main/proposals/0007-live-edge.md}
   */
  readonly liveEdgeStart: number;
  /**
   * The length of the live edge window in seconds starting from `liveEdgeStart` and ending at
   * `seekableEnd`. If the `duration` of the stream is `Infinity` or the stream is non-live then
   * this value will default to 0.
   */
  readonly liveEdgeWindow: number;
  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @defaultValue 'unknown'
   */
  mediaType: MediaType;
  /**
   * Whether the audio is muted or not.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted}
   */
  muted: boolean;
  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `false` will begin/resume playback.
   *
   * @defaultValue true
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused}
   */
  paused: boolean;
  /**
   * Contains the ranges of the media source that the browser has played, if any.
   *
   * @defaultValue TimeRanges
   */
  played: TimeRanges;
  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @defaultValue false
   */
  playing: boolean;
  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to `false` does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-playsinline}
   */
  playsinline: boolean;
  /**
   * Sets the rate at which the media is being played back. This is used to implement user
   * controls for fast forward, slow motion, and so forth. The normal playback rate is multiplied
   * by this value to obtain the current rate, so a value of 1.0 indicates normal speed.
   *
   * Examples:
   *
   * - `0.5` = slow down to 50% of the normal speed
   * - `1.5` = speed up normal speed by 50%
   * - `2` = double the normal speed
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate}
   */
  playbackRate: number;
  /**
   * Whether the player is currently in picture-in-picture mode.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API}
   */
  pictureInPicture: boolean;
  /**
   * Configures the preload setting of the underlying media provider once it can load (see
   * `loading` property).
   *
   * The `preload` attribute provides a hint to the browser about what the author thinks will
   * lead to the best user experience with regards to what content is loaded before the video is
   * played. The recommended default is `metadata`.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload}
   */
  preload: 'none' | 'metadata' | 'auto';
  /**
   * Whether auto quality selection is active.
   */
  autoQuality: boolean;
  /**
   * The list of available video qualities/renditions. This will be empty if quality information
   * is not provided by the current media provider.
   */
  qualities: VideoQuality[];
  /**
   * The current playback quality. This will be `null` if quality information is not provided
   * by the current media provider.
   */
  quality: VideoQuality | null;
  /**
   * The list of available audio tracks. This will be empty if audio track information is not
   * provided by the current media provider.
   */
  audioTracks: AudioTrack[];
  /**
   * The current audio track. This will be `null` if audio track information is not provided by
   *  the current media provider.
   */
  audioTrack: AudioTrack | null;
  /**
   * Whether the current video quality list is read-only, meaning quality selections can only
   * be set internally by the media provider. This will only be `true` when working with particular
   * third-party embeds such as YouTube.
   */
  canSetQuality: boolean;
  /**
   * Contains the time ranges that the user is able to seek to, if any. This tells us which parts
   * of the media can be played without delay; this is irrespective of whether that part has
   * been downloaded or not.
   *
   * Some parts of the media may be seekable but not buffered if byte-range
   * requests are enabled on the server. Byte range requests allow parts of the media file to
   * be delivered from the server and so can be ready to play almost immediately — thus they are
   * seekable.
   *
   * @defaultValue TimeRanges
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable}
   */
  seekable: TimeRanges;
  /**
   * Contains the earliest time in seconds at which media can be seeked to. Generally this is
   * zero, but for live streams it may start at a non-zero value.
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable}
   */
  readonly seekableStart: number;
  /**
   * The latest time in seconds at which media can be seeked to. This will default to `Infinity`
   * if no seekable range is found. If byte-range requests are enabled on the server this should
   * be equal to the media duration - note for live streams duration is a moving target.
   *
   * @defaultValue Infinity
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable}
   */
  readonly seekableEnd: number;
  /**
   * The length of the seekable window in seconds starting from `seekableStart` and ending at
   * `seekableEnd`.
   *
   * @defaultValue 0
   */
  readonly seekableWindow: number;
  /**
   * Whether media is actively seeking to a new playback position.
   *
   * @defaultValue false
   */
  seeking: boolean;
  /**
   * The URL and optionally type of the current media resource/s to be considered for playback.
   * Use `source` to get the currently loaded resource.
   *
   * @defaultValue []
   */
  sources: MediaSrc[];
  /**
   * The chosen media resource. Defaults to `{ src: '', type: '' }` if no media has been loaded.
   *
   * @defaultValue { src: '', type: '' }
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc}
   */
  source: MediaSrc;
  /** Alias for `source`. */
  currentSrc: MediaSrc;
  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @defaultValue false
   */
  started: boolean;
  /**
   * The current media stream type. This value helps determine what type of UI should be
   * displayed and whether seeking operations are permitted during live streams. If seeking
   * is permitted, set this value to `live:dvr` or `ll-live:dvr`.
   */
  streamType: MediaStreamType;
  /**
   * The type of player view that should be used (i.e., audio or video). By default this is set
   * to `video`.
   *
   * @defaultValue 'video'
   */
  viewType: MediaViewType;
  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @defaultValue 1
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume}
   */
  volume: number;
  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @defaultValue false
   */
  waiting: boolean;

  // !!! INTERNALS !!!

  /** @internal */
  attemptingAutoplay: boolean;
  /** @internal */
  canLoadPoster: boolean | null;
  /** @internal */
  providedViewType: MediaViewType;
  /** @internal */
  providedStreamType: MediaStreamType;
  /** @internal */
  inferredStreamType: MediaStreamType;
  /** @internal */
  liveSyncPosition: number | null;
}
