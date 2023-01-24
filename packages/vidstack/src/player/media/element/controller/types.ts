import type { Dispose, MaybeStopEffect } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type { UseFullscreen } from '../../../../foundation/fullscreen/use-fullscreen';
import type { LoggerEvents } from '../../../../foundation/logger/events';
import type { LogLevel } from '../../../../foundation/logger/log-level';
import type { ScreenOrientationEvents } from '../../../../foundation/orientation/events';
import type { ScreenOrientationLockType } from '../../../../foundation/orientation/screen-orientation';
import type { UseScreenOrientation } from '../../../../foundation/orientation/use-screen-orientation';
import type { MediaEvents, UserIdleChangeEvent } from '../../events';
import type { MediaProviderElement } from '../../provider/types';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from '../../request-events';
import type { MediaState } from '../../state';
import type { MediaStore } from '../../store';
import type { MediaLoadingStrategy } from '../../types';
import type { UseMediaUser } from '../../user';

export interface MediaAdapter
  extends Pick<MediaState, 'paused' | 'muted' | 'currentTime' | 'volume' | 'playsinline'> {
  readonly fullscreen?: UseFullscreen;
  play(): Promise<void>;
  pause(): Promise<void>;
}

export interface MediaControllerProps
  // Prefer picking off the `MediaContext` type to ensure docs are kept in-sync.
  extends Pick<
    MediaState,
    | 'autoplay'
    | 'muted'
    | 'volume'
    | 'poster'
    | 'loop'
    | 'view'
    | 'controls'
    | 'paused'
    | 'currentTime'
    | 'playsinline'
  > {
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
}

export interface MediaController {
  /** @internal */
  readonly $store: MediaStore;
  /**
   * Media user settings which currently supports configuring user idling behavior.
   */
  readonly user: UseMediaUser;
  /**
   * The current media provider element.
   */
  readonly provider: MediaProviderElement | null;
  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on this element.
   */
  readonly orientation: UseScreenOrientation;
  /**
   * This object contains all current media state (e.g., `paused`, `playing`, etc.).
   */
  readonly state: Readonly<MediaState>;
  /**
   * Enables subscribing to live updates of individually selected media state.
   *
   * @example
   * ```ts
   * const media = document.querySelector('vds-media');
   * media.store.paused.subscribe(paused => {
   *   // ...
   * });
   * ```
   */
  readonly store: MediaControllerStore;
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
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   */
  startLoading(): void;
  /**
   * Attempts to display this element in fullscreen. The promise will resolve if successful, and
   * reject if not.
   */
  enterFullscreen(target?: MediaFullscreenRequestTarget): Promise<void>;
  /**
   * Attempts to display this element inline by exiting fullscreen.
   */
  exitFullscreen(target?: MediaFullscreenRequestTarget): Promise<void>;
}

export type MediaControllerStore = {
  readonly [Prop in keyof MediaStore]: Subscribable<MediaStore[Prop]>;
};

export interface Subscribable<Value> {
  subscribe(callback: (value: Value) => MaybeStopEffect): Dispose;
}

export interface MediaControllerEvents
  extends MediaEvents,
    MediaRequestEvents,
    MediaUserEvents,
    ScreenOrientationEvents,
    LoggerEvents {}

export interface MediaControllerElement
  extends HTMLCustomElement<MediaControllerProps, MediaControllerEvents>,
    MediaController {}

export interface MediaUserEvents {
  'user-idle-change': UserIdleChangeEvent;
}
