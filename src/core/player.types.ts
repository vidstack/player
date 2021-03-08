import { Context } from '@wcom/context';

import { MediaType } from './MediaType';
import { ViewType } from './ViewType';

export type Source = string;

export type PlayerContext = {
  readonly [P in keyof PlayerProps]: Context<PlayerProps[P]>;
};

export type PlayerContextProvider = Record<string, unknown> &
  {
    -readonly [P in keyof PlayerProps as `${P}Ctx`]: PlayerProps[P];
  };

export type ReadonlyPlayerState = Readonly<
  Pick<
    PlayerProps,
    | 'currentSrc'
    | 'currentPoster'
    | 'duration'
    | 'buffered'
    | 'isBuffering'
    | 'isPlaying'
    | 'hasPlaybackStarted'
    | 'hasPlaybackEnded'
    | 'isPlaybackReady'
    | 'viewType'
    | 'isAudioView'
    | 'isVideoView'
    | 'mediaType'
    | 'isAudio'
    | 'isVideo'
  >
>;

export type WritablePlayerState = Omit<PlayerProps, keyof ReadonlyPlayerState>;

export interface PlayerProps {
  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode. Defaults to `undefined`.
   */
  aspectRatio: string | undefined;

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   */
  readonly currentSrc: Source;

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
   */
  volume: number;

  /**
   * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
   * not started to play and has not seeked. Setting this value seeks the media to the new
   * time. The value can be set to a minimum of `0` and maximum of the total length of the
   * media (indicated by the duration prop).
   */
  currentTime: number;

  /**
   * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
   * not started. Setting this to `true` will begin/resume playback.
   */
  paused: boolean;

  /**
   * Indicates whether a user interface should be shown for controlling the resource. Set this to
   * `false` when you want to provide your own custom controls, and `true` if you want the current
   * provider to supply its own default controls. Depending on the provider, changing this prop
   * may cause the player to completely reset.
   */
  controls: boolean;

  /**
   * The URL of the current poster. Defaults to `''` if no media/poster has been given or
   * loaded.
   */
  readonly currentPoster: string;

  /**
   * Whether the audio is muted or not.
   */
  muted: boolean;

  /**
   * Whether the video is to be played "inline", that is within the element's playback area. Note
   * that setting this to `false` does not imply that the video will always be played in fullscreen.
   * Depending on the provider, changing this prop may cause the player to completely reset.
   */
  playsinline: boolean;

  /**
   * A `double` indicating the total playback length of the media in seconds. Defaults
   * to `-1` if no media has been loaded. If the media is being streamed live then the duration is
   * equal to `Infinity`.
   */
  readonly duration: number;

  /**
   * The length of the media in seconds (`double`) that has been downloaded by the browser.
   */
  readonly buffered: number;

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   */
  readonly isBuffering: boolean;

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   */
  readonly isPlaying: boolean;

  /**
   * Whether the media playback has started. In other words it will be true if `currentTime > 0`.
   */
  readonly hasPlaybackStarted: boolean;

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   */
  readonly hasPlaybackEnded: boolean;

  /**
   * Whether media is ready for playback to begin, analgous with `canPlay`.
   */
  readonly isPlaybackReady: boolean;

  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   */
  readonly viewType: ViewType;

  /**
   * Whether the current view is of type `audio`, shorthand for `viewType === ViewType.Audio`.
   */
  readonly isAudioView: boolean;

  /**
   * Whether the current view is of type `video`, shorthand for `viewType === ViewType.Video`.
   */
  readonly isVideoView: boolean;

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   */
  readonly mediaType: MediaType;

  /**
   * Whether the current media is of type `audio`, shorthand for `mediaType === MediaType.Audio`.
   */
  readonly isAudio: boolean;

  /**
   * Whether the current media is of type `video`, shorthand for `mediaType === MediaType.Video`.
   */
  readonly isVideo: boolean;
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
   * Determines if the connected media provider can play the given `type`. The `type` is
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
  canPlayType(type: string): boolean;
}

// V8ToIstanbul fails when no value is exported.
export default class {}
