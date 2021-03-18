import { CanPlay } from './CanPlay';
import { MediaType } from './MediaType';
import { ScreenOrientation, ScreenOrientationLock } from './ScreenOrientation';
import { ViewType } from './ViewType';

export type Source = string;

export type WritablePlayerState = Pick<
  PlayerProps,
  | 'aspectRatio'
  | 'autoplay'
  | 'controls'
  | 'currentTime'
  | 'muted'
  | 'loop'
  | 'paused'
  | 'playsinline'
  | 'volume'
>;

export type ReadonlyPlayerState = Readonly<
  Omit<PlayerProps, keyof WritablePlayerState>
>;

export interface PlayerProps {
  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode. Defaults to `undefined`.
   */
  aspectRatio: string | undefined;

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
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay
   */
  autoplay: boolean;

  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source that the
   * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
   * contiguous but if the user jumps about while media is buffering, it may contain holes.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
   */
  readonly buffered: TimeRanges;

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   */
  readonly waiting: boolean;

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
   */
  controls: boolean;

  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   */
  readonly currentPoster: string;

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
   */
  readonly currentSrc: Source;

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
   */
  currentTime: number;

  /**
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `NaN`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
   */
  readonly duration: number;

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
   */
  readonly ended: boolean;

  /**
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
   */
  loop: boolean;

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   */
  readonly mediaType: MediaType;

  /**
   * Whether the audio is muted or not.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted
   */
  muted: boolean;

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `true` will begin/resume playback.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused
   */
  paused: boolean;

  /**
   * Whether the native Screen Orientation API is available.
   */
  readonly canOrientScreen: boolean;

  /**
   * Whether the user agent can play the media, but estimates that **not enough** data has been
   * loaded to play the media up to its end without having to stop for further buffering of
   * content.
   */
  readonly canPlay: boolean;

  /**
   * Whether the user agent can play the media, and estimates that enough data has been
   * loaded to play the media up to its end without having to stop for further buffering
   * of content.
   */
  readonly canPlayThrough: boolean;

  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   */
  readonly canRequestFullscreen: boolean;

  /**
   * Whether the player is currently in fullscreen mode.
   */
  readonly fullscreen: boolean;

  /**
   * Contains the ranges of the media source that the browser has played, if any.
   */
  readonly played: TimeRanges;

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   */
  readonly playing: boolean;

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to `false` does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  playsinline: boolean;

  /**
   * The current player orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   */
  readonly screenOrientation: ScreenOrientation | undefined;

  /**
   * Whether the screen orientation is currently locked.
   */
  readonly screenOrientationLocked: boolean;

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
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable
   */
  readonly seekable: TimeRanges;

  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   */
  readonly started: boolean;

  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   */
  readonly viewType: ViewType;

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
   */
  volume: number;
}

export interface PlayerMethods {
  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies.
   */
  play(): Promise<void>;

  /**
   * Pauses playback of the media.
   */
  pause(): Promise<void>;

  /**
   * Determines if the media provider can play the given `type`. The `type` is
   * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
   *
   * @examples
   * - `audio/mp3`
   * - `video/mp4`
   * - `video/webm; codecs="vp8, vorbis"`
   * - `/my-audio-file.mp3`
   * - `youtube/RO7VcUAsf-I`
   * - `vimeo.com/411652396`
   * - `https://www.youtube.com/watch?v=OQoz7FCWkfU`
   * - `https://media.vidstack.io/hls/index.m3u8`
   * - `https://media.vidstack.io/dash/index.mpd`
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
   */
  canPlayType(type: string): CanPlay;

  /**
   * Determines if the media provider "should" play the given type. "Should" in this
   * context refers to the `canPlayType()` method returning `Maybe` or `Probably`.
   *
   * @param type - refer to `canPlayType`.
   */
  shouldPlayType(type: string): boolean;

  /**
   * Locks the orientation of the player to the desired orientation type using the
   * Screen Orientation API. This method will throw an error if the API is unavailable.
   *
   * @param lockType - The screen lock orientation type.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  lockOrientation(lockType: ScreenOrientationLock): Promise<void>;

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  unlockOrientation(): Promise<void>;

  /**
   * Requests to enter fullscreen mode, returning a `Promise` that will resolve if the request is
   * made, or reject with a reason for failure.
   *
   * Do not rely on a resolved promise to determine if the player is in fullscreen or not. The only
   * way to be certain is by listening to the `vds-fullscreen-change` event.
   *
   * Some common reasons for failure are:
   *
   * - The fullscreen API is not available.
   * - The request is made when `viewType` is `audio`.
   * - The user has not interacted with the page yet.
   *
   * @param options - When supplied, options's navigationUI member indicates whether showing
   * navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity
   * is preferred over screen space, and if set to "hide", more screen space is preferred. User
   * agents are always free to honor user preference over the application's. The default value
   * "auto" indicates no application preference.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   * @spec https://fullscreen.spec.whatwg.org
   */
  requestFullscreen(): Promise<void>;

  /**
   * Requests to exit fullscreen mode, returning a `Promise` that will resolve if the request
   * is successful, or reject with a reason for failure. Refer to `requestFullscreen()` for more
   * information.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   * @spec https://fullscreen.spec.whatwg.org
   */
  exitFullscreen(): Promise<void>;
}

// V8ToIstanbul fails when no value is exported.
export default class {}
