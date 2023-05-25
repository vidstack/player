import { peek, signal } from 'maverick.js';
import { ComponentController } from 'maverick.js/element';
import { isNumber, listenEvent } from 'maverick.js/std';

import { canOrientScreen } from '../../utils/support';
import type { ScreenOrientationAPI } from './events';
import type { ScreenOrientationLockType, ScreenOrientationType } from './types';

const CAN_USE_SCREEN_ORIENTATION_API = canOrientScreen();

export class ScreenOrientationController extends ComponentController<ScreenOrientationAPI> {
  private _type = signal(getScreenOrientation());
  private _locked = signal(false);
  private _currentLock: ScreenOrientationLockType | undefined;

  /**
   * The current screen orientation type.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get type(): ScreenOrientationType | undefined {
    return this._type();
  }

  /**
   * Whether the screen orientation is currently locked.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get locked(): boolean {
    return this._locked();
  }

  /**
   * Whether the viewport is in a portrait orientation.
   *
   * @signal
   */
  get portrait() {
    return this._type().startsWith('portrait');
  }

  /**
   * Whether the viewport is in a landscape orientation.
   *
   * @signal
   */
  get landscape() {
    return this._type().startsWith('landscape');
  }

  /**
   * Whether the native Screen Orientation API is available.
   */
  get supported(): boolean {
    return CAN_USE_SCREEN_ORIENTATION_API;
  }

  protected override onConnect() {
    if (CAN_USE_SCREEN_ORIENTATION_API) {
      listenEvent(screen.orientation, 'change', this._onOrientationChange.bind(this));
    } else {
      const query = window.matchMedia('(orientation: landscape)');
      query.onchange = this._onOrientationChange.bind(this);
      return () => (query.onchange = null);
    }
  }

  protected override async onDisconnect() {
    if (CAN_USE_SCREEN_ORIENTATION_API && this._locked()) await this.unlock();
  }

  protected _onOrientationChange(event: Event) {
    this._type.set(getScreenOrientation()!);
    this.dispatch('orientation-change', {
      detail: {
        orientation: peek(this._type),
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
    if (peek(this._locked) || this._currentLock === lockType) return;
    assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    this._locked.set(true);
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
    if (!peek(this._locked)) return;
    assertScreenOrientationAPI();
    this._currentLock = undefined;
    await screen.orientation.unlock();
    this._locked.set(false);
  }
}

function assertScreenOrientationAPI() {
  if (CAN_USE_SCREEN_ORIENTATION_API) return;
  throw Error(
    __DEV__
      ? '[vidstack] screen orientation API is not available'
      : '[vidstack] no orientation API',
  );
}

function getScreenOrientation(): ScreenOrientationType {
  if (__SERVER__) return 'portrait-primary';
  if (CAN_USE_SCREEN_ORIENTATION_API) return window.screen!.orientation!.type;
  return window.innerWidth >= window.innerHeight ? 'landscape-primary' : 'portrait-primary';
}
