import {
  Context,
  ContextProviderRecord,
  createContext,
  derivedContext,
  ExtractContextRecordTypes,
  isDerviedContext,
  OmitDerivedContextFromRecord
} from '../base/context';
import { keysOf } from '../utils/object';
import { MediaType } from './MediaType';
import { createTimeRanges } from './time-ranges';
import { ViewType } from './ViewType';

// Decalred here as they are used within derived contexts below.
const buffered = createContext(createTimeRanges());
const duration = createContext(NaN);
const mediaType = createContext(MediaType.Unknown);
const seekable = createContext(createTimeRanges());
const viewType = createContext(ViewType.Unknown);
const isLiveVideo = derivedContext(
  [mediaType],
  ([m]) => m === MediaType.LiveVideo
);

/**
 * The media context record contains a collection of contexts that map 1:1 with media
 * state. This context enables state to be passed down to elements lower in the media
 * subtree. It's updated by the media controller. If you're creating your own elements to place
 * inside the media container you can use it like so...
 *
 * ```js
 * import { LitElement } from 'lit';
 * import { consumeContext, mediaContext } from "@vidstack/elements";
 *
 * class MyElement extends LitElement {
 *   \@consumeConsumeContext(mediaContext.paused)
 *   mediaPaused = mediaContext.paused.initialValue;
 * }
 * ```
 */
export const mediaContext = {
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
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay
   */
  autoplay: createContext(false),
  /**
   * Set to an `Error` object when autoplay has failed to begin playback. This
   * can be used to determine when to show a recovery UI in the event autoplay fails.
   *
   * @default undefined
   */
  autoplayError: createContext<Error | undefined>(undefined),
  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source that the
   * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
   * contiguous but if the user jumps about while media is buffering, it may contain holes.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
   * @default TimeRanges
   */
  buffered,
  /**
   * A `double` indicating the total playback length of the media in seconds. If no media data is
   * available, the returned value is `NaN`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
   *
   * @default NaN
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
   */
  duration,
  /**
   * Converts the `buffered` time ranges into an absolute value to indicate the amount of
   * media that has buffered from `0` to `duration`.
   *
   * @default 0
   */
  bufferedAmount: derivedContext(
    [buffered, duration],
    ([buffered, duration]) => {
      const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
      return end > duration ? duration : end;
    }
  ),
  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
   */
  canRequestFullscreen: createContext(false),
  /**
   * Whether the user agent can play the media, but estimates that **not enough** data has been
   * loaded to play the media up to its end without having to stop for further buffering of
   * content.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event
   */
  canPlay: createContext(false),
  /**
   * Whether the user agent can play the media, and estimates that enough data has been
   * loaded to play the media up to its end without having to stop for further buffering
   * of content.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event
   */
  canPlayThrough: createContext(false),
  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
   */
  controls: createContext(false),
  /**
   * Indicates whether a custom user interface should be shown for controlling the resource. If
   * `true`, it is expected that `controls` is set to `false` (the default) to avoid double
   * controls. The `controls` property refers to native controls.
   *
   * @default false
   */
  customControls: createContext(false),
  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   *
   * @default ''
   */
  currentPoster: createContext(''),
  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @default ''
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
   */
  currentSrc: createContext(''),
  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   *
   * @default 0
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
   */
  currentTime: createContext(0),
  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
   */
  ended: createContext(false),
  /**
   * Contains the most recent error or undefined if there's been none. You can listen for
   * `vds-error` event updates and examine this object to debug further. The error could be a
   * native `MediaError` object or something else.
   *
   * @default undefined
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
   */
  error: createContext(undefined) as Context<unknown>,
  /**
   * Whether the player is currently in fullscreen mode.
   *
   * @default false
   */
  fullscreen: createContext(false),
  /**
   * Whether there is no user activity for a set period of time (default is `3000ms`). Activity
   * is measured by any action occurring inside the media such as toggling controls, seeking
   * etc.
   *
   * @default false
   */
  idle: createContext(false),
  /**
   * Whether media should automatically start playing from the beginning (replay) every time
   * it ends.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
   */
  loop: createContext(false),
  /**
   * Whether the current media is a live stream.
   */
  live: derivedContext([isLiveVideo], ([d]) => d),
  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @default MediaType.Unknown
   */
  mediaType,
  /**
   * Whether the current media type is of type audio. Derived from `mediaType`, shorthand for
   * `mediaType === MediaType.Audio`.
   *
   * @default false
   */
  isAudio: derivedContext([mediaType], ([m]) => m === MediaType.Audio),
  /**
   * Whether the current media type is of type video. Derived from `mediaType`, shorthand for
   * `mediaType === MediaType.Video`.
   *
   * @default false
   */
  isVideo: derivedContext([mediaType], ([m]) => m === MediaType.Video),
  /**
   * Whether the current media type is of type live video. Derived from `mediaType`, shorthand for
   * `mediaType === MediaType.LiveVideo`.
   *
   * @default false
   */
  isLiveVideo,
  /**
   * Whether the audio is muted or not.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted
   */
  muted: createContext(false),
  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `false` will begin/resume playback.
   *
   * @default true
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused
   */
  paused: createContext(true),
  /**
   * Contains the ranges of the media source that the browser has played, if any.
   *
   * @default TimeRanges
   */
  played: createContext(createTimeRanges()),
  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @default false
   */
  playing: createContext(false),
  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to `false` does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   *
   * @default false
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-playsinline
   */
  playsinline: createContext(false),
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
   * @default TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable
   */
  seekable,
  /**
   * Converts the `seekable` time ranges into an absolute value to indicate the amount of
   * media that is seekable from `0` to `duration`.
   *
   * @default 0
   */
  seekableAmount: derivedContext(
    [seekable, duration],
    ([seekable, duration]) => {
      const end = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
      return end > duration ? duration : end;
    }
  ),
  /**
   * Whether media is actively seeking to an new playback position.
   *
   * @default false
   */
  seeking: createContext(false),
  /**
   * Whether media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @default false
   */
  started: createContext(false),
  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   *
   * @default ViewType.Unknown
   */
  viewType,
  /**
   * Whether the current view type is of type audio. Derived from `viewType`, shorthand for
   * `viewType === ViewType.Audio`.
   *
   * @default false
   */
  isAudioView: derivedContext([viewType], ([v]) => v === ViewType.Audio),
  /**
   * Whether the current view type is of type video. Derived from `viewType`, shorthand for
   * `viewType === ViewType.Video`.
   *
   * @default false
   */
  isVideoView: derivedContext([viewType], ([v]) => v === ViewType.Video),
  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   *
   * @default 1
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
   */
  volume: createContext(1),
  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @default false
   */
  waiting: createContext(false)
};

export type MediaContextRecord = typeof mediaContext;

export type MediaContextProviderRecord =
  ContextProviderRecord<MediaContextRecord>;

export type MediaContextRecordValues =
  ExtractContextRecordTypes<MediaContextRecord>;
