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
  _disconnectDisposal = new DisposalBin();

  /**
   * @protected
   * @type {ScreenOrientation | undefined}
   */
  _screenOrientation;

  /**
   * @protected
   * @type {boolean}
   */
  _isScreenOrientationLocked = false;

  /**
   * @param {ScreenOrientationControllerHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationControllerHost}
     */
    this._host = host;

    this._updateScreenOrientation();

    host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async _handleHostConnected() {
    this._updateScreenOrientation();
    this._addScreenOrientationEventListeners();
  }

  /**
   * Dispose of any event listeners and unlock screen orientation (if locked).
   *
   * @protected
   * @returns {Promise<void>}
   */
  async _handleHostDisconnected() {
    if (this.canOrient && this._isScreenOrientationLocked) await this.unlock();
    this._disconnectDisposal.empty();
  }

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   *
   * @type {ScreenOrientation | undefined}
   */
  get currentOrientation() {
    return this._screenOrientation;
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
    return this._isScreenOrientationLocked;
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
    this._throwIfScreenOrientationUnavailable();

    await screen.orientation.lock(
      /** @type {OrientationLockType} */ (lockType)
    );

    this._isScreenOrientationLocked = true;
    this._host.dispatchEvent(
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
    this._throwIfScreenOrientationUnavailable();
    await screen.orientation.unlock();
    this._isScreenOrientationLocked = false;
    this._host.dispatchEvent(
      new ScreenOrientationLockChangeEvent({
        detail: screen.orientation.type
      })
    );
  }

  /**
   * @protected
   */
  _addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this._disconnectDisposal.add(
      this._addScreenOrientationChangeEventListener()
    );
  }

  /**
   * @protected
   * @returns {() => void} Stop listening function.
   */
  _addScreenOrientationChangeEventListener() {
    return listen(
      screen.orientation,
      'change',
      this._handleOrientationChange.bind(this)
    );
  }

  /**
   * @protected
   * @param {Event} event
   */
  _handleOrientationChange(event) {
    this._screenOrientation = window.screen.orientation.type;
    this._host.dispatchEvent(
      new ScreenOrientationChangeEvent({
        detail: this._screenOrientation,
        originalEvent: event
      })
    );
  }

  /**
   * @protected
   */
  _updateScreenOrientation() {
    this._screenOrientation = IS_CLIENT
      ? window.screen?.orientation?.type
      : undefined;
  }

  /**
   * @protected
   * @throws {Error} - Will throw if Screen Orientation API is unavailable.
   */
  _throwIfScreenOrientationUnavailable() {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
