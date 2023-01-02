import type { MediaErrorDetail, MediaSrc, MediaType, ViewType } from './types';

/** @internal */
export const ATTEMPTING_AUTOPLAY = Symbol(__DEV__ ? 'ATTEMPTING_AUTOPLAY' : 0);
/** @internal */
export const CAN_LOAD_POSTER = Symbol(__DEV__ ? 'CAN_LOAD_POSTER' : 0);

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
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `0`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @defaultValue 0
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration}
   */
  duration: number;
  /**
   * Converts the `buffered` time ranges into an absolute value to indicate the amount of
   * media that has buffered from `0` to `duration`.
   *
   * @defaultValue 0
   */
  readonly bufferedAmount: number;
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
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  canFullscreen: boolean;
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
   * `vds-error` event updates and examine this object to debug further.
   *
   * @defaultValue undefined
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error}
   */
  error: MediaErrorDetail | undefined;
  /**
   * Whether the player is currently in fullscreen mode.
   *
   * @defaultValue false
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
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @defaultValue false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop}
   */
  loop: boolean;
  /**
   * Whether media is currently a live stream.
   */
  live: boolean;
  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @defaultValue MediaType.Unknown
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
   * Converts the `seekable` time ranges into an absolute value to indicate the amount of
   * media that is seekable from `0` to `duration`.
   *
   * @defaultValue 0
   */
  readonly seekableAmount: number;
  /**
   * Whether media is actively seeking to a new playback position.
   *
   * @defaultValue false
   */
  seeking: boolean;
  /**
   * The chosen media resource. Defaults to `{ src: '' }` if no media has been loaded.
   *
   * @defaultValue { src: '' }
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc}
   */
  source: MediaSrc;
  /**
   * The URL and optionally type of the current media resource/s to be considered for playback.
   * Use `source` to get the currently loaded resource.
   *
   * @defaultValue []
   */
  sources: MediaSrc[];
  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @defaultValue false
   */
  started: boolean;
  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   *
   * @defaultValue ViewType.Unknown
   */
  viewType: ViewType;
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
  /** @internal */
  [ATTEMPTING_AUTOPLAY]: boolean;
  /** @internal */
  [CAN_LOAD_POSTER]: boolean;
}
