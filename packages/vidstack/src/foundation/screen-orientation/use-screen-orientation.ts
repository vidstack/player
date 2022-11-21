import { effect, Observable, observable } from 'maverick.js';
import { listenEvent, useHost } from 'maverick.js/std';

import { connectedHostElement } from '../../utils/host';
import { canOrientScreen } from '../../utils/support';
import { dispatchLockChange, dispatchOrientationChange } from './dispatch';
import type { ScreenOrientationLockType, ScreenOrientationType } from './screen-orientation';

export function useHostedScreenOrientation() {
  const host = useHost();
  return useScreenOrientation({
    $target: connectedHostElement(host),
  });
}

const CAN_ORIENT_SCREEN = canOrientScreen();

export function useScreenOrientation({
  $target,
}: UseScreenOrientationOptions): UseScreenOrientation {
  const $orientation = observable<ScreenOrientationType | undefined>(getScreenOrientation()),
    $locked = observable(false);

  if (CAN_ORIENT_SCREEN) {
    effect(() => {
      const target = $target();
      if (!target) return;

      listenEvent(screen.orientation, 'change', (event) => {
        const orientation = getScreenOrientation()!;
        $orientation.set(orientation);
        dispatchOrientationChange(target, orientation, event);
      });

      return async () => {
        if (CAN_ORIENT_SCREEN && $locked()) await unlock();
      };
    });
  }

  async function lock(lockType) {
    assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    $locked.set(true);
    dispatchLockChange($target(), lockType);
  }

  async function unlock() {
    assertScreenOrientationAPI();
    await screen.orientation.unlock();
    $locked.set(false);
    const lockType = screen.orientation.type as ScreenOrientationLockType;
    dispatchLockChange($target(), lockType);
  }

  return {
    get $orientation() {
      return $orientation();
    },
    get $locked() {
      return $locked();
    },
    get canOrient() {
      return CAN_ORIENT_SCREEN;
    },
    lock,
    unlock,
  };
}

function assertScreenOrientationAPI() {
  if (!CAN_ORIENT_SCREEN) return;
  throw Error(
    __DEV__
      ? '[vidstack] screen orientation API is not available'
      : '[vidstack] no orientation API',
  );
}

function getScreenOrientation() {
  return __SERVER__ ? undefined : (window.screen?.orientation?.type as ScreenOrientationType);
}

export type UseScreenOrientationOptions = {
  $target: Observable<Element | null>;
};

export type UseScreenOrientation = {
  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available. This is a reactive observable call.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  readonly $orientation: ScreenOrientationType | undefined;
  /**
   * Whether the screen orientation is currently locked.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  readonly $locked: boolean;
  /**
   * Whether the native Screen Orientation API is available.
   */
  readonly canOrient: boolean;
  /**
   * Locks the orientation of the screen to the desired orientation type using the
   * Screen Orientation API.
   *
   * @param lockType - The screen lock orientation type.
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  lock(lockType: ScreenOrientationLockType): Promise<void>;
  /**
   * Unlocks the orientation of the screen to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  unlock(): Promise<void>;
};
