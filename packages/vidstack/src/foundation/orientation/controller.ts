import { ComponentController } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import { canOrientScreen } from '../../utils/support';
import type { ScreenOrientationAPI } from './events';
import type { ScreenOrientationLockType, ScreenOrientationType } from './types';

const CAN_ORIENT_SCREEN = canOrientScreen();

export class ScreenOrientationController extends ComponentController<ScreenOrientationAPI> {
  private _orientation = getScreenOrientation();
  private _locked = false;
  private _currentLock: ScreenOrientationLockType | undefined;

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get orientation(): ScreenOrientationType | undefined {
    return this._orientation;
  }

  /**
   * Whether the screen orientation is currently locked.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get locked() {
    return this._locked;
  }

  /**
   * Whether the native Screen Orientation API is available.
   */
  get supported(): boolean {
    return CAN_ORIENT_SCREEN;
  }

  protected override onConnect() {
    if (CAN_ORIENT_SCREEN) {
      listenEvent(screen.orientation, 'change', this._onOrientationChange.bind(this));
    }
  }

  protected override async onDisconnect() {
    if (CAN_ORIENT_SCREEN && this._locked) await this.unlock();
  }

  protected _onOrientationChange(event: Event) {
    this._orientation = getScreenOrientation()!;
    this.dispatch('orientation-change', {
      detail: {
        orientation: this._orientation,
        lock: this._currentLock,
      },
      trigger: event,
    });
  }

  /**
   * Locks the orientation of the screen to the desired orientation type using the
   * Screen Orientation API.
   *
   * @param lockType - The screen lock orientation type.
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async lock(lockType: ScreenOrientationLockType): Promise<void> {
    if (this._locked) return;
    assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    this._locked = true;
    this._currentLock = lockType;
  }

  /**
   * Unlocks the orientation of the screen to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async unlock(): Promise<void> {
    if (!this._locked) return;
    assertScreenOrientationAPI();
    this._currentLock = undefined;
    await screen.orientation.unlock();
    this._locked = false;
  }
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
