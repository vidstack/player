import { canOrientScreen, IS_CLIENT } from '../../utils/support.js';
import { DisposalBin, EventDispatcher, listen } from '../events/index.js';
import {
  ScreenOrientation,
  ScreenOrientationLock
} from './ScreenOrientation.js';

/**
 * Contains the logic for managing the window's screen orientation.
 *
 * @extends EventDispatcher<import('./types').ScreenOrientationEvents>
 *
 * @example
 * ```js
 * import { VdsElement, ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends VdsElement {
 *   screenOrientationController = new ScreenOrientationController(this);
 * }
 * ```
 */
export class ScreenOrientationController extends EventDispatcher {
  /**
   * @protected
   * @readonly
   */
  disposal = new DisposalBin();

  /**
   * @protected
   * @type {ScreenOrientation | undefined}
   */
  screenOrientation;

  /**
   * @protected
   * @type {boolean}
   */
  isScreenOrientationLocked = false;

  /**
   * @protected
   * @readonly
   * @type {import('.').ScreenOrientationHost}
   */
  host;

  /**
   * @param {import('.').ScreenOrientationHost} host
   */
  constructor(host) {
    super();

    this.host = host;

    this.updateScreenOrientation();

    host.addController({
      hostConnected: () => {
        this.updateScreenOrientation();
        this.addScreenOrientationEventListeners();
      },
      hostDisconnected: () => {
        this.destroy();
      }
    });
  }

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   *
   * @returns {ScreenOrientation | undefined}
   * @default undefined
   */
  get currentOrientation() {
    return this.screenOrientation;
  }

  /**
   * Whether the native Screen Orientation API is available.
   *
   * @returns {boolean}
   */
  get canOrient() {
    return canOrientScreen();
  }

  /**
   * Whether the screen orientation is currently locked.
   *
   * @returns {boolean}
   * @default false
   */
  get isLocked() {
    return this.isScreenOrientationLocked;
  }

  /**
   * Locks the orientation of the player to the desired orientation type using the
   * Screen Orientation API. This method will throw an error if the API is unavailable.
   *
   * @param {ScreenOrientationLock} lockType - The screen lock orientation type.
   * @returns {Promise<void>}
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  async lock(lockType) {
    this.throwIfScreenOrientationUnavailable();

    await screen.orientation.lock(
      /** @type {OrientationLockType} */ (lockType)
    );

    this.isScreenOrientationLocked = true;
    this.dispatchEvent('orientation-lock-change', {
      detail: true
    });
  }

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @returns {Promise<void>}
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  async unlock() {
    this.throwIfScreenOrientationUnavailable();
    await screen.orientation.unlock();
    this.isScreenOrientationLocked = false;
    this.dispatchEvent('orientation-lock-change', {
      detail: false
    });
  }

  /**
   * Dispose of any event listeners and unlock screen orientation (if locked).
   *
   * @protected
   * @returns {Promise<void>}
   */
  async destroy() {
    if (this.canOrient && this.isScreenOrientationLocked) await this.unlock();
    this.disposal.empty();
    super.destroy();
  }

  /**
   * @protected
   * @returns {void}
   */
  addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this.disposal.add(this.addScreenOrientationChangeEventListener());
  }

  /**
   * @protected
   * @returns {import('../types/utils').Unsubscribe}
   */
  addScreenOrientationChangeEventListener() {
    return listen(
      screen.orientation,
      'change',
      this.handleOrientationChange.bind(this)
    );
  }

  /**
   * @protected
   * @returns {void}
   */
  handleOrientationChange() {
    this.screenOrientation = window.screen.orientation.type;
    this.dispatchEvent('orientation-change', {
      detail: this.screenOrientation
    });
  }

  /**
   * @protected
   * @returns {void}
   */
  updateScreenOrientation() {
    this.screenOrientation = IS_CLIENT
      ? window.screen?.orientation?.type
      : undefined;
  }

  /**
   * @protected
   * @returns {void}
   * @throws {Error} - Will throw if Screen Orientation API is unavailable.
   */
  throwIfScreenOrientationUnavailable() {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
