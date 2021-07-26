import { canOrientScreen, IS_CLIENT } from '@utils/support';
import { ReactiveElement } from 'lit';

import { DisposalBin, listen, vdsEvent } from '../events/index';
import { ScreenOrientation, ScreenOrientationLock } from './ScreenOrientation';

export type ScreenOrientationControllerHost = ReactiveElement;

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
  protected readonly _disconnectDisposal = new DisposalBin();

  protected _screenOrientation?: ScreenOrientation;

  protected _isScreenOrientationLocked = false;

  constructor(protected readonly _host: ScreenOrientationControllerHost) {
    this._updateScreenOrientation();

    _host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  protected async _handleHostConnected(): Promise<void> {
    this._updateScreenOrientation();
    this._addScreenOrientationEventListeners();
  }

  /**
   * Dispose of any event listeners and unlock screen orientation (if locked).
   */
  protected async _handleHostDisconnected(): Promise<void> {
    if (this.canOrient && this._isScreenOrientationLocked) await this.unlock();
    this._disconnectDisposal.empty();
  }

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   */
  get currentOrientation(): ScreenOrientation | undefined {
    return this._screenOrientation;
  }

  /**
   * Whether the native Screen Orientation API is available.
   */
  get canOrient(): boolean {
    return canOrientScreen();
  }

  /**
   * Whether the screen orientation is currently locked.
   *
   * @default false
   */
  get isLocked(): boolean {
    return this._isScreenOrientationLocked;
  }

  /**
   * Locks the orientation of the player to the desired orientation type using the
   * Screen Orientation API. This method will throw an error if the API is unavailable.
   *
   * @param lockType - The screen lock orientation type.
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @see https://w3c.github.io/screen-orientation
   */
  async lock(lockType: ScreenOrientationLock): Promise<void> {
    this._throwIfScreenOrientationUnavailable();

    await screen.orientation.lock(lockType);

    this._isScreenOrientationLocked = true;
    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-lock-change', {
        detail: lockType
      })
    );
  }

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @see https://w3c.github.io/screen-orientation
   */
  async unlock(): Promise<void> {
    this._throwIfScreenOrientationUnavailable();
    await screen.orientation.unlock();
    this._isScreenOrientationLocked = false;
    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-lock-change', {
        detail: screen.orientation.type as ScreenOrientationLock
      })
    );
  }

  protected _addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this._disconnectDisposal.add(
      this._addScreenOrientationChangeEventListener()
    );
  }

  /**
   * @returns Stop listening function.
   */
  protected _addScreenOrientationChangeEventListener(): () => void {
    return listen(
      screen.orientation,
      'change',
      this._handleOrientationChange.bind(this)
    );
  }

  protected _handleOrientationChange(event: Event) {
    this._screenOrientation = window.screen.orientation
      .type as ScreenOrientation;
    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-change', {
        detail: this._screenOrientation,
        originalEvent: event
      })
    );
  }

  protected _updateScreenOrientation() {
    this._screenOrientation = IS_CLIENT
      ? (window.screen?.orientation?.type as ScreenOrientation)
      : undefined;
  }

  /**
   * @throws {Error} - Will throw if Screen Orientation API is unavailable.
   */
  protected _throwIfScreenOrientationUnavailable() {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
