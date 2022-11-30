import type { MaverickElement } from 'maverick.js/element';
import type { Simplify } from 'type-fest';

import type { UseFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import type { UseScreenOrientation } from '../../../foundation/orientation/use-screen-orientation';
import type { MediaState } from '../context';
import type { MediaEvents } from '../events';

export type MediaProvider = MaverickElement<MediaProviderProps, MediaEvents> & MediaProviderMembers;

export type MediaLoadingStrategy = 'eager' | 'idle' | 'visible' | 'custom';

export type MediaProviderProps = Simplify<
  // Prefer picking off the `MediaContext` type to ensure docs are kept in-sync.
  Pick<
    MediaState,
    | 'autoplay'
    | 'muted'
    | 'volume'
    | 'poster'
    | 'loop'
    | 'controls'
    | 'paused'
    | 'currentTime'
    | 'playsinline'
  > & {
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
     * - `custom`: media will wait for the `startLoadingMedia()` method or `vds-start-loading` event.
     */
    load: MediaLoadingStrategy;
    /**
     * This will indicate the orientation to lock the screen to when in fullscreen mode and
     * the Screen Orientation API is available. The default is `undefined` which indicates
     * no screen orientation change.
     */
    fullscreenOrientation: ScreenOrientationLockType | undefined;
  }
>;

export const SET_CAN_LOAD_POSTER = Symbol(__DEV__ ? 'SET_CAN_LOAD_POSTER' : 0);

export type MediaProviderMembers = Simplify<
  MediaProviderProps & {
    /**
     * Controls the screen orientation of the current browser window and dispatches orientation
     * change events on this element.
     */
    readonly orientation: UseScreenOrientation;
    /**
     * Controls the fullscreen state of this element and dispatches fullscreen change/error
     * events on this element.
     */
    readonly fullscreen: UseFullscreen;
    /**
     * Whether media is allowed to begin loading. This depends on the `loading` configuration.
     *
     * - If `eager`, this will return `true` immediately.
     * - If `lazy`, this will return `true` after the media has entered the viewport.
     * - If `custom`, this will return `true` after the `startLoadingMedia()` method is called.
     *
     * @observable
     */
    readonly canLoad: boolean;
    /**
     * Determines whether the native poster can load. Used to avoid loading posters twice when a
     * custom poster element is being used (eg: `<vds-poster>`).
     *
     * @observable
     */
    readonly canLoadPoster: boolean;
    /** @internal */
    [SET_CAN_LOAD_POSTER](canLoad: boolean): void;
    /**
     * Begins/resumes playback of the media. If this method is called programmatically before the
     * user has interacted with the player, the promise may be rejected subject to the browser's
     * autoplay policies.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
     */
    play(): Promise<void>;
    /**
     * Pauses playback of the media.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
     */
    pause(): Promise<void>;
    /**
     * Attempts to display this element in fullscreen. The promise will resolve if successful, and
     * reject if not.
     */
    enterFullscreen(): Promise<void>;
    /**
     * Attempts to display this element inline by exiting fullscreen.
     */
    exitFullscreen(): Promise<void>;
    /**
     * Called when media can begin loading. Calling this method will trigger the initial provider
     * loading process. Calling it more than once has no effect.
     */
    startLoadingMedia(): void;
  }
>;

export type MediaProviderAdapter = Simplify<
  Pick<
    MediaProviderMembers,
    'paused' | 'muted' | 'currentTime' | 'volume' | 'play' | 'pause' | 'playsinline'
  >
>;
