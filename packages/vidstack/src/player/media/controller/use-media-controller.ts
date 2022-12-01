import { provideContext } from 'maverick.js';

import { UseFullscreen, useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import type { LogLevel } from '../../../foundation/logger/log-level';
import { useHostedLogPrinter } from '../../../foundation/logger/use-log-printer';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import {
  useHostedScreenOrientation,
  UseScreenOrientation,
} from '../../../foundation/orientation/use-screen-orientation';
import { withMediaFullscreenOptions } from '../provider/media-fullscreen';
import { MediaProviderContext } from '../provider/use-media-provider';
import { MediaStateContext } from '../store';
import { UseMediaUser, useMediaUser } from '../user';
import { useMediaRequestManager } from './use-media-request-manager';
import { useMediaStateManager } from './use-media-state-manager';

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components. The controller's main responsibilities are:
 *
 * - Providing the media store context down to all child consumers (i.e., UI elements) so they can
 * subscribe to media state changes.
 *
 * - Listening for media request events so it can try and satisfy them (e.g., accepting a play
 * request and satisfying it by calling play on the media provider).
 *
 * - Listening to media events and updating state in the media store.
 */
export function useMediaController(props: {
  fullscreenOrientation: ScreenOrientationLockType | undefined;
}): UseMediaController {
  provideContext(MediaStateContext);
  provideContext(MediaProviderContext);

  const user = useMediaUser(),
    orientation = useHostedScreenOrientation(),
    fullscreen = useFullscreen(
      withMediaFullscreenOptions({
        get lockType() {
          return props.fullscreenOrientation;
        },
        orientation,
      }),
    ),
    logPrinter = __DEV__ ? useHostedLogPrinter() : undefined,
    requestManager = useMediaRequestManager({ user, fullscreen });

  useMediaStateManager(requestManager);

  return {
    user,
    orientation,
    fullscreen,
    get logLevel() {
      return __DEV__ ? logPrinter!.logLevel : 'silent';
    },
    set logLevel(level) {
      if (__DEV__) logPrinter!.logLevel = level;
    },
    enterFullscreen: fullscreen.requestFullscreen,
    exitFullscreen: fullscreen.exitFullscreen,
  };
}

export interface UseMediaController {
  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  logLevel: LogLevel;
  /**
   * Media user settings which currently supports configuring user idling behavior.
   */
  user: UseMediaUser;
  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on this element.
   */
  orientation: UseScreenOrientation;
  /**
   * Controls the fullscreen state of this element and dispatches fullscreen change/error
   * events on this element.
   */
  fullscreen: UseFullscreen;
  /**
   * Attempts to display this element in fullscreen. The promise will resolve if successful, and
   * reject if not.
   */
  enterFullscreen(): Promise<void>;
  /**
   * Attempts to display this element inline by exiting fullscreen.
   */
  exitFullscreen(): Promise<void>;
}
