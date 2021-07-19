import { canOrientScreen, IS_CLIENT } from '../../utils/support.js';
import { DisposalBin, listen } from '../events/index.js';
import {
  ScreenOrientationChangeEvent,
  ScreenOrientationLockChangeEvent
} from './events.js';
import {
  ScreenOrientation,
  ScreenOrientationLock
} from './ScreenOrientation.js';

/**
 * @typedef {import('lit').ReactiveElement} ScreenOrientationControllerHost
 */

/**
 * Contains the logic for managing the window's screen orientation.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
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
   * @param {ScreenOrientationControllerHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationControllerHost}
     */
    this.host = host;

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
    this.disconnectDisposal.empty();
  }

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   *
   * @type {ScreenOrientation | undefined}
   */
  get currentOrientation() {
    return this.screenOrientation;
  }

  /**
   * Whether the native Screen Orientation API is available.
   *
   * @type {boolean}
   */
  get canOrient() {
    return canOrientScreen();
  }

  /**
   * Whether the screen orientation is currently locked.
   *
   * @type {boolean}
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
   * @see https://w3c.github.io/screen-orientation
   */
  async lock(lockType) {
    this.throwIfScreenOrientationUnavailable();

    await screen.orientation.lock(
      /** @type {OrientationLockType} */ (lockType)
    );

    this.isScreenOrientationLocked = true;
    this.host.dispatchEvent(
      new ScreenOrientationLockChangeEvent({
        detail: lockType
      })
    );
  }

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @returns {Promise<void>}
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @see https://w3c.github.io/screen-orientation
   */
  async unlock() {
    this.throwIfScreenOrientationUnavailable();
    await screen.orientation.unlock();
    this.isScreenOrientationLocked = false;
    this.host.dispatchEvent(
      new ScreenOrientationLockChangeEvent({
        detail: screen.orientation.type
      })
    );
  }

  /**
   * @protected
   */
  addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this.disconnectDisposal.add(this.addScreenOrientationChangeEventListener());
  }

  /**
   * @protected
   * @returns {() => void} Stop listening function.
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
   * @param {Event} event
   */
  handleOrientationChange(event) {
    this.screenOrientation = window.screen.orientation.type;
    this.host.dispatchEvent(
      new ScreenOrientationChangeEvent({
        detail: this.screenOrientation,
        originalEvent: event
      })
    );
  }

  /**
   * @protected
   */
  updateScreenOrientation() {
    this.screenOrientation = IS_CLIENT
      ? window.screen?.orientation?.type
      : undefined;
  }

  /**
   * @protected
   * @throws {Error} - Will throw if Screen Orientation API is unavailable.
   */
  throwIfScreenOrientationUnavailable() {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
