import type { Dispose, Maybe } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type { LoggerEvents } from '../../../foundation/logger/events';
import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationEvents } from '../../../foundation/orientation/events';
import type { ScreenOrientationAdapter } from '../../../foundation/orientation/screen-orientation';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/types';
import type { MediaEvents, UserIdleChangeEvent } from '../events';
import type { AudioProvider } from '../providers/audio/provider';
import type { HLSProviderEvents } from '../providers/hls/events';
import type { HLSProvider } from '../providers/hls/provider';
import type { VideoPresentationEvents } from '../providers/video/presentation/events';
import type { VideoProvider } from '../providers/video/provider';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from '../request-events';
import type { MediaStore } from '../store';
import type { MediaLoadingStrategy, MediaResource } from '../types';
import type { MediaUser } from '../user';

export interface MediaControllerProps
  // Prefer picking off the `MediaStore` type to ensure docs are kept in-sync.
  extends Pick<
    MediaStore,
    | 'autoplay'
    | 'controls'
    | 'currentTime'
    | 'loop'
    | 'muted'
    | 'paused'
    | 'playsinline'
    | 'poster'
    | 'preload'
    | 'playbackRate'
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
   */
  load: MediaLoadingStrategy;
  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   */
  userIdleDelay: number;
  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
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
}

export type AnyMediaProvider =
  | ({ type: 'audio' } & AudioProvider)
  | ({ type: 'video' } & VideoProvider)
  | ({ type: 'hls' } & HLSProvider);

export interface MediaController {
  /** @internal */
  readonly $store: MediaStore;
  /**
   * Media user settings which currently supports configuring user idling behavior.
   */
  readonly user: MediaUser;
  /**
   * The current media provider.
   */
  readonly provider: AnyMediaProvider | null;
  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on this element.
   */
  readonly orientation: ScreenOrientationAdapter;
  /**
   * This object contains all current media state (e.g., `paused`, `playing`, etc.).
   */
  readonly state: Readonly<MediaStore>;
  /**
   * Enables subscribing to live updates of individually selected media state.
   *
   * @example
   * ```ts
   * const player = document.querySelector('media-player');
   * player.subscribe(({ paused }) => {
   *   // ...
   * });
   * ```
   */
  readonly subscribe: MediaSubscribe;
  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies. This method will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  play(): Promise<void>;
  /**
   * Pauses playback of the media. This will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  pause(): Promise<void>;
  /**
   * Attempts to display this element in fullscreen. The promise will resolve if successful, and
   * reject if not. This will throw if any fullscreen API is _not_ currently available.
   */
  enterFullscreen(target?: MediaFullscreenRequestTarget): Promise<void>;
  /**
   * Attempts to display this element inline by exiting fullscreen. This will throw if any
   * fullscreen API is _not_ currently available.
   */
  exitFullscreen(target?: MediaFullscreenRequestTarget): Promise<void>;
  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   */
  seekToLiveEdge(): void;
  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   */
  startLoading(): void;
}

export interface MediaSubscribe {
  (callback: (store: MediaStore) => Maybe<Dispose>): Dispose;
}

export interface MediaControllerEvents
  extends MediaEvents,
    MediaRequestEvents,
    MediaUserEvents,
    ScreenOrientationEvents,
    LoggerEvents,
    VideoPresentationEvents,
    HLSProviderEvents {}

export interface MediaControllerElement
  extends HTMLCustomElement<MediaControllerProps, MediaControllerEvents>,
    MediaController {}

export interface MediaUserEvents {
  'user-idle-change': UserIdleChangeEvent;
}
