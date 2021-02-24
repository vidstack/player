import { Context } from '@wcom/context';
import { Device } from '../utils';

export type Source = string;

export enum ViewType {
  Unknown = 'unknown',
  Audio = 'audio',
  Video = 'video',
}

export enum MediaType {
  Unknown = 'unknown',
  Audio = 'audio',
  Video = 'video',
}

export type PlayerContext = {
  readonly [P in keyof PlayerState]: Context<PlayerState[P]>;
};

export type PlayerContextProvider = Record<string, unknown> &
  {
    -readonly [P in keyof PlayerState as `${P}Ctx`]: PlayerState[P];
  };

export type ReadonlyPlayerState = Readonly<
  Pick<
    PlayerState,
    | 'uuid'
    | 'currentSrc'
    | 'duration'
    | 'buffered'
    | 'device'
    | 'isMobileDevice'
    | 'isDesktopDevice'
    | 'isBuffering'
    | 'isPlaying'
    | 'hasPlaybackStarted'
    | 'hasPlaybackEnded'
    | 'isProviderReady'
    | 'isPlaybackReady'
    | 'viewType'
    | 'isAudioView'
    | 'isVideoView'
    | 'mediaType'
    | 'isAudio'
    | 'isVideo'
  >
>;

export type WritablePlayerState = Omit<PlayerState, keyof ReadonlyPlayerState>;

export type PlayerProps = WritablePlayerState & ReadonlyPlayerState;

export interface PlayerState {
  /**
   * Randomly generated version 4 [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) UUID which can
   * be used to identify the player.
   *
   * @readonly
   */
  readonly uuid: string;

  /**
   * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
   * media has been loaded.
   *
   * @readonly
   */
  readonly currentSrc: Source;

  /**
   * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume.
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
   * The URL of the poster for the current media resource. Defaults to `undefined` if media/poster
   * has been given.
   */
  poster: string | undefined;

  /**
   * Whether the audio is muted or not.
   */
  muted: boolean;

  /**
   * The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the player is not in fullscreen mode. Defaults to `16:9`.
   */
  aspectRatio: string;

  /**
   * A `double` indicating the total playback length of the media in seconds. Defaults
   * to `-1` if no media has been loaded. If the media is being streamed live then the duration is
   * equal to `Infinity`.
   *
   * @readonly
   */
  readonly duration: number;

  /**
   * The length of the media in seconds (`double`) that has been downloaded by the browser.
   *
   * @readonly
   */
  readonly buffered: number;

  /**
   * The type of device the player has loaded in. This is determined by using `ResizeObserver`
   * (if available), otherwise it'll fallback to parsing `window.navigator.userAgent`. The
   * maximum width for the device to be considered mobile is 480px.
   *
   * @readonly
   */
  readonly device: Device;

  /**
   * Whether the current `device` is mobile (shorthand for `device === Device.Mobile`).
   *
   * @readonly
   */
  readonly isMobileDevice: boolean;

  /**
   * Whether the current `device` is desktop (shorthand for `device === Device.Desktop`).
   *
   * @readonly
   */
  readonly isDesktopDevice: boolean;

  /**
   * Whether playback has temporarily stopped because of a lack of temporary data.
   *
   * @readonly
   */
  readonly isBuffering: boolean;

  /**
   * Whether media is actively playing back. Defaults to `false` if no media has
   * loaded or playback has not started.
   *
   * @readonly
   */
  readonly isPlaying: boolean;

  /**
   * Whether the media playback has started. In other words it will be true if `currentTime > 0`.
   *
   * @readonly
   */
  readonly hasPlaybackStarted: boolean;

  /**
   * Whether media playback has reached the end. In other words it'll be true
   * if `currentTime === duration`.
   *
   * @readonly
   */
  readonly hasPlaybackEnded: boolean;

  /**
   * Whether the current provider has loaded and is ready to be interacted with.
   *
   * @readonly
   */
  readonly isProviderReady: boolean;

  /**
   * Whether media is ready for playback to begin, analgous with `canPlayThrough`.
   *
   * @readonly
   */
  readonly isPlaybackReady: boolean;

  /**
   * The type of player view that is being used, whether it's an audio player view or
   * video player view. Normally if the media type is of audio then the view is of type audio, but
   * in some cases it might be desirable to show a different view type. For example, when playing
   * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
   * when no media has been loaded.
   *
   * @readonly
   */
  readonly viewType: ViewType;

  /**
   * Whether the current view is of type `audio`, shorthand for `viewType === ViewType.Audio`.
   *
   * @readonly
   */
  readonly isAudioView: boolean;

  /**
   * Whether the current view is of type `video`, shorthand for `viewType === ViewType.Video`.
   *
   * @readonly
   */
  readonly isVideoView: boolean;

  /**
   * The type of media that is currently active, whether it's audio or video. Defaults
   * to `unknown` when no media has been loaded or the type cannot be determined.
   *
   * @readonly
   */
  readonly mediaType: MediaType;

  /**
   * Whether the current media is of type `audio`, shorthand for `mediaType === MediaType.Audio`.
   *
   * @readonly
   */
  readonly isAudio: boolean;

  /**
   * Whether the current media is of type `video`, shorthand for `mediaType === MediaType.Video`.
   *
   * @readonly
   */
  readonly isVideo: boolean;
}
