import type { Writable } from 'type-fest';

import type { LogLevel } from '../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../foundation/orientation/types';
import type { GoogleCastOptions } from '../../providers/google-cast/types';
import { MEDIA_KEY_SHORTCUTS } from '../keyboard/controller';
import type { MediaKeyShortcuts, MediaKeyTarget } from '../keyboard/types';
import type { MediaStorage } from '../state/media-storage';
import type { MediaState } from './player-state';
import type { MediaSrc } from './src-types';
import type { MediaLoadingStrategy, MediaPosterLoadingStrategy } from './types';

export const mediaPlayerProps: MediaPlayerProps = {
  artist: '',
  autoplay: false,
  autoPlay: false,
  clipStartTime: 0,
  clipEndTime: 0,
  controls: false,
  currentTime: 0,
  crossorigin: null,
  crossOrigin: null,
  duration: -1,
  fullscreenOrientation: 'landscape',
  googleCast: {},
  load: 'visible',
  posterLoad: 'visible',
  logLevel: __DEV__ ? 'warn' : 'silent',
  loop: false,
  muted: false,
  paused: true,
  playsinline: false,
  playsInline: false,
  playbackRate: 1,
  poster: '',
  preload: 'metadata',
  preferNativeHLS: false,
  src: '',
  title: '',
  controlsDelay: 2000,
  hideControlsOnMouseLeave: false,
  viewType: 'unknown',
  streamType: 'unknown',
  volume: 1,
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  keyDisabled: false,
  keyTarget: 'player',
  keyShortcuts: MEDIA_KEY_SHORTCUTS,
  storage: null,
};

export interface MediaStateAccessors
  extends Pick<MediaState, 'paused' | 'muted' | 'volume' | 'currentTime' | 'playbackRate'> {}

export type PlayerSrc = MediaSrc | MediaSrc[];

export interface MediaPlayerProps
  // Prefer picking off the `MediaStore` type to ensure docs are kept in-sync.
  extends Pick<
    Writable<MediaState>,
    | 'artist'
    | 'autoPlay'
    | 'clipStartTime'
    | 'clipEndTime'
    | 'controls'
    | 'currentTime'
    | 'loop'
    | 'muted'
    | 'paused'
    | 'playsInline'
    | 'poster'
    | 'preload'
    | 'playbackRate'
    | 'viewType'
    | 'volume'
    | 'title'
    // live
    | 'streamType'
    | 'liveEdgeTolerance'
    | 'minLiveDVRWindow'
  > {
  /** @deprecated - Use `autoPlay` */
  autoplay: boolean;
  /** @deprecated - Use `crossOrigin` */
  crossorigin: string | true | null;
  /**
   * Defines how the media element handles cross-origin requests, thereby enabling the
   * configuration of the CORS requests for the element's fetched data.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
   */
  crossOrigin: true | MediaState['crossOrigin'];
  /**
   * A `double` indicating the total playback length of the media in seconds. If this is not
   * provided it will be determined when the media loaded.
   */
  duration: number;
  /**
   * The URL and optionally type of the current media resource/s to be considered for playback.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-source}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject}
   */
  src: PlayerSrc;
  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  logLevel: LogLevel;
  /**
   * Indicates when the provider can begin loading media.
   *
   * - `eager`: media will be loaded immediately.
   * - `idle`: media will be loaded after the page has loaded and `requestIdleCallback` is fired.
   * - `visible`: media will delay loading until the provider has entered the viewport.
   * - `custom`: media will wait for the `startLoading()` method or `media-start-loading` event.
   * - `play`: media will delay loading until there is a play request.
   *
   *  @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  load: MediaLoadingStrategy;
  /**
   * Indicates when the player can begin loading the poster.
   *
   * - `eager`: poster will be loaded immediately.
   * - `idle`: poster will be loaded after the page has loaded and `requestIdleCallback` is fired.
   * - `visible`: poster will delay loading until the provider has entered the viewport.
   * - `custom`: poster will wait for the `startLoadingPoster()` method or `media-poster-start-loading` event.
   *
   *  @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  posterLoad: MediaPosterLoadingStrategy;
  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state and hide controls.
   */
  controlsDelay: number;
  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   */
  hideControlsOnMouseLeave: boolean;
  /**
   * This method will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available.
   */
  fullscreenOrientation: ScreenOrientationLockType | undefined;
  /**
   * Google Cast options.
   *
   * @see {@link https://developers.google.com/cast/docs/reference/web_sender/cast.framework.CastOptions}
   */
  googleCast: GoogleCastOptions;
  /** @deprecated - Use `playsInline`. */
  playsinline: boolean;
  /**
   * Whether native HLS support is preferred over using `hls.js`. We recommend setting this to
   * `false` to ensure a consistent and configurable experience across browsers. In addition, our
   * live stream support and DVR detection is much better with `hls.js` so choose accordingly.
   *
   * This should generally only be set to `true` if (1) you're working with HLS streams, and (2)
   * you want AirPlay to work via the native Safari controls (i.e., `controls` attribute is
   * present on the `<media-player>` element).
   */
  preferNativeHLS: boolean;
  /**
   * Whether keyboard support is disabled for the media player globally. This property won't disable
   * standard ARIA keyboard controls for individual components when focused.
   *
   * @defaultValue 'false'
   */
  keyDisabled: boolean;
  /**
   * The target on which to listen for keyboard events (e.g., `keydown`):
   *
   * - `document`: the player will listen for events on the entire document. In the case that
   * multiple players are on the page, only the most recently active player will receive input.
   * - `player`: the player will listen for events on the player itself or one of its children
   * were recently interacted with.
   *
   * @defaultValue `player`
   */
  keyTarget: MediaKeyTarget;
  /**
   * Extends global media player keyboard shortcuts. The shortcuts can be specified as a
   * space-separated list of combinations (e.g., `p Control+Space`), array, or callbacks. See the
   * provided doc link for more information.
   *
   * Do note, if `aria-keyshortcuts` is specified on a component then it will take precedence
   * over the respective value set here.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts}
   * @example
   * ```ts
   * player.keyShortcuts = {
   *  // Space-separated list.
   *  togglePaused: 'k Space',
   *  toggleMuted: 'm',
   *  toggleFullscreen: 'f',
   *  togglePictureInPicture: 'i',
   *  toggleCaptions: 'c',
   *  // Array.
   *  seekBackward: ['j', 'J', 'ArrowLeft'],
   *  seekForward: ['l', 'L', 'ArrowRight'],
   *  volumeUp: 'ArrowUp',
   *  volumeDown: 'ArrowDown',
   *  speedUp: '>',
   *  slowDown: '<',
   *  // Callback.
   *  fooBar: {
   *    keys: ['k', 'Space'],
   *    callback(event) {}
   *   },
   * }
   * ```
   */
  keyShortcuts: MediaKeyShortcuts;
  /**
   * Determines whether volume, time, and other player settings should be saved to storage
   * and used when initializing media. The two options for enabling storage are:
   *
   * 1. You can provide a string which will use our local storage solution and the given string as
   * a key prefix.
   *
   * 2. Or, you can provide your own storage solution (e.g., database) by implementing
   * the `MediaStorage` interface and providing the object/class.
   */
  storage: string | MediaStorage | null;
}
