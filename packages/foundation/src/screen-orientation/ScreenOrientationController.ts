import { type ReactiveElement } from 'lit';

import { vdsEvent } from '../events';
import { LogDispatcher } from '../logger';
import { DisposalBin, listen } from '../utils/events';
import { canOrientScreen, IS_CLIENT } from '../utils/support';
import { ScreenOrientation, ScreenOrientationLock } from './ScreenOrientation';

/**
 * This class contains logic for managing the window's screen orientation.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { ScreenOrientationController } from '@vidstack/player';
 *
 * class MyElement extends LitElement {
 *   screenOrientationController = new ScreenOrientationController(this);
 * }
 * ```
 */
export class ScreenOrientationController {
  protected readonly _listenerDisposal: DisposalBin;
  protected _screenOrientation?: ScreenOrientation;
  protected _isScreenOrientationLocked = false;

  protected readonly _logger = __DEV__ ? new LogDispatcher(this._host) : undefined;

  constructor(protected readonly _host: ReactiveElement) {
    this._updateScreenOrientation();
    this._listenerDisposal = new DisposalBin();

    _host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this),
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
    this._listenerDisposal.empty();
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
   * @defaultValue false
   */
  get isLocked(): boolean {
    return this._isScreenOrientationLocked;
  }

  /**
   * Locks the orientation of the player to the desired orientation type using the
   * Screen Orientation API. This method will throw an error if the API is unavailable.
   *
   * @param lockType - The screen lock orientation type.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see https://w3c.github.io/screen-orientation
   */
  async lock(lockType: ScreenOrientationLock): Promise<void> {
    this._throwIfScreenOrientationUnavailable();

    if (__DEV__) {
      this._logger?.debug('locking screen orientation to', lockType);
    }

    await screen.orientation.lock(lockType);

    this._isScreenOrientationLocked = true;
    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-lock-change', {
        bubbles: true,
        composed: true,
        detail: lockType,
      }),
    );
  }

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see https://w3c.github.io/screen-orientation
   */
  async unlock(): Promise<void> {
    this._throwIfScreenOrientationUnavailable();

    if (__DEV__) {
      this._logger?.debug('unlocking screen orientation');
    }

    await screen.orientation.unlock();
    this._isScreenOrientationLocked = false;
    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-lock-change', {
        bubbles: true,
        composed: true,
        detail: screen.orientation.type as ScreenOrientationLock,
      }),
    );
  }

  protected _addScreenOrientationEventListeners() {
    if (!this.canOrient) return;
    this._listenerDisposal.add(this._addScreenOrientationChangeEventListener());
  }

  /**
   * @returns Stop listening function.
   */
  protected _addScreenOrientationChangeEventListener(): () => void {
    return listen(screen.orientation, 'change', this._handleOrientationChange.bind(this));
  }

  protected _handleOrientationChange(event: Event) {
    this._screenOrientation = window.screen.orientation.type as ScreenOrientation;

    if (__DEV__ && this._isScreenOrientationLocked) {
      this._logger?.debug('screen orientation changed to', this._screenOrientation);
    }

    this._host.dispatchEvent(
      vdsEvent('vds-screen-orientation-change', {
        bubbles: true,
        composed: true,
        detail: this._screenOrientation,
        triggerEvent: event,
      }),
    );
  }

  protected _updateScreenOrientation() {
    this._screenOrientation = IS_CLIENT
      ? (window.screen?.orientation?.type as ScreenOrientation)
      : undefined;
  }

  /**
   * @throws Will throw if Screen Orientation API is unavailable.
   */
  protected _throwIfScreenOrientationUnavailable() {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
