import { defineProp, type PropDeclarations } from 'maverick.js/element';

import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/types';
import { MEDIA_KEY_SHORTCUTS } from '../keyboard/controller';
import type { MediaKeyShortcuts, MediaKeyTarget } from '../keyboard/types';
import type { TextTrack, TextTrackInit } from '../tracks/text/text-track';
import type { MediaState } from './store';
import type { MediaLoadingStrategy, MediaResource } from './types';

export const mediaPlayerProps: PropDeclarations<PlayerProps> = {
  autoplay: false,
  aspectRatio: defineProp({
    value: null,
    type: {
      from(value) {
        if (!value) return null;
        if (!value.includes('/')) return +value;
        const [width, height] = value.split('/').map(Number);
        return +(width / height).toFixed(4);
      },
    },
  }),
  controls: false,
  currentTime: 0,
  crossorigin: null,
  fullscreenOrientation: undefined,
  load: 'visible',
  logLevel: 'silent',
  loop: false,
  muted: false,
  paused: true,
  playsinline: false,
  playbackRate: 1,
  poster: '',
  preload: 'metadata',
  preferNativeHLS: defineProp<boolean>({
    value: false,
    attribute: 'prefer-native-hls',
  }),
  src: '',
  userIdleDelay: 2000,
  viewType: 'unknown',
  streamType: 'unknown',
  volume: 1,
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  keyDisabled: false,
  keyTarget: 'player',
  keyShortcuts: MEDIA_KEY_SHORTCUTS,
  title: '',
  thumbnails: null,
  textTracks: defineProp<(TextTrack | TextTrackInit)[]>({
    value: [],
    attribute: false,
  }),
};

export interface MediaStateAccessors
  extends Pick<
    MediaState,
    'paused' | 'muted' | 'volume' | 'currentTime' | 'playsinline' | 'playbackRate'
  > {}

export interface PlayerProps
  // Prefer picking off the `MediaStore` type to ensure docs are kept in-sync.
  extends Pick<
    MediaState,
    | 'autoplay'
    | 'controls'
    | 'crossorigin'
    | 'currentTime'
    | 'loop'
    | 'muted'
    | 'paused'
    | 'playsinline'
    | 'poster'
    | 'preload'
    | 'playbackRate'
    | 'title'
    | 'thumbnails'
    | 'viewType'
    | 'volume'
    // live
    | 'streamType'
    | 'liveEdgeTolerance'
    | 'minLiveDVRWindow'
  > {
  /**
   * The URL and optionally type of the current media resource/s to be considered for playback.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-source}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject}
   */
  src:
    | MediaResource
    | { src: MediaResource; type?: string }
    | { src: MediaResource; type?: string }[];
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
   *
   *  @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  load: MediaLoadingStrategy;
  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   */
  userIdleDelay: number;
  /**
   * This method will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  fullscreenOrientation: ScreenOrientationLockType | undefined;
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
   * A list of text track objects to load.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/text-tracks}
   */
  textTracks: (TextTrack | TextTrackInit)[];
  /**
   * The aspect ratio of the player media given as 'width/height' (e.g., 16/9).
   */
  aspectRatio: number | null;
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
   * space-separated list of combinations (e.g., `p Control+Space`), see the provided doc link
   * for more information.
   *
   * Do note, if `aria-keyshortcuts` is specified on a component then it will take precedence
   * over the respective value set here.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts}
   * @example
   * ```js
   * keyShortcuts = {
   *   togglePaused: 'k Space',
   *   toggleMuted: 'm',
   *   toggleFullscreen: 'f',
   *   togglePictureInPicture: 'i',
   *   toggleCaptions: 'c',
   *   seekBackward: 'ArrowLeft',
   *   seekForward: 'ArrowRight',
   *   volumeUp: 'ArrowUp',
   *   volumeDown: 'ArrowDown',
   * }
   * ```
   */
  keyShortcuts: MediaKeyShortcuts;
}
