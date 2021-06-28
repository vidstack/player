import { canOrientScreen, IS_CLIENT } from '../../utils/support.js';
import { DisposalBin, listen } from '../events/index.js';
import {
  ScreenOrientation,
  ScreenOrientationLock
} from './ScreenOrientation.js';

/**
 * @typedef {import('lit').ReactiveElement} ScreenOrientationHost
 */

/**
 * @typedef {{
 *  handleOrientationChange?(): void;
 *  handleOrientationLockChange?(): void;
 * }} ScreenOrientationControllerDelegate
 */

/**
 * Contains the logic for managing the window's screen orientation.
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
export class ScreenOrientationController {
  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

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
   * @type {Set<ScreenOrientationControllerDelegate>}
   */
  delegates = new Set();

  /**
   * @param {ScreenOrientationHost} host
   * @param {ScreenOrientationControllerDelegate} [delegate]
   */
  constructor(host, delegate = {}) {
    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationHost}
     */
    this.host = host;

    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationControllerDelegate}
     */
    this.delegates.add(delegate);

    this.updateScreenOrientation();

    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async handleHostConnected() {
    this.updateScreenOrientation();
    this.addScreenOrientationEventListeners();
  }

  /**
   * Dispose of any event listeners and unlock screen orientation (if locked).
   *
   * @protected
   * @returns {Promise<void>}
   */
  async handleHostDisconnected() {
    if (this.canOrient && this.isScreenOrientationLocked) await this.unlock();
    this.delegates.clear();
    this.disconnectDisposal.empty();
  }

  /**
   * @param {ScreenOrientationControllerDelegate} delegate
   * @returns {(() => void)} Cleanup function to remove delegate.
   */
  addDelegate(delegate) {
    this.delegates.add(delegate);
    return () => {
      this.delegates.delete(delegate);
    };
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
    this.delegates.forEach((delegate) => {
      delegate.handleOrientationLockChange?.();
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
    this.delegates.forEach((delegate) => {
      delegate.handleOrientationLockChange?.();
    });
  }

  /**
   * @protected
   * @returns {void}
   */
  addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this.disconnectDisposal.add(this.addScreenOrientationChangeEventListener());
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
    this.delegates.forEach((delegate) => {
      delegate.handleOrientationChange?.();
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
