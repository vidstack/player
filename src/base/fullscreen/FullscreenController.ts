import fscreen from 'fscreen';
import { ReactiveElement } from 'lit';

import { DEV_MODE } from '../../env';
import { isUndefined, noop } from '../../utils/unit';
import { DisposalBin, listen, vdsEvent } from '../events';
import { Logger } from '../logger';
import {
  ScreenOrientationController,
  ScreenOrientationLock
} from '../screen-orientation';

export type FullscreenControllerHost = ReactiveElement & {
  requestFullscreen(): Promise<void>;
  exitFullscreen(): Promise<void>;
};

/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { FullscreenController, ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   fullscreenController = new FullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *   );
 *
 *   requestFullscreen() {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   exitFullscreen() {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class FullscreenController {
  protected readonly _logger!: Logger;

  protected readonly _listenerDisposal: DisposalBin;

  /**
   * Used to avoid an inifinite loop by indicating when the native `requestFullscreen()` method
   * is being called.
   *
   * Bad Call Stack: host.requestFullscreen() -> controller.requestFullscreen() ->
   * fscreen.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen() ...
   *
   * Good Call Stack: host.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen()
   * -> (native request fullscreen method on host)
   */
  isRequestingNativeFullscreen = false;

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode. The default
   * is `undefined` which indicates no screen orientation change.
   */
  screenOrientationLock?: ScreenOrientationLock;

  constructor(
    protected readonly _host: FullscreenControllerHost,
    protected readonly _screenOrientationController: ScreenOrientationController
  ) {
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }

    this._listenerDisposal = new DisposalBin(
      _host,
      DEV_MODE && { name: 'listenerDisposal', owner: this }
    );

    _host.addController({
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * Dispose of any event listeners and exit fullscreen (if active).
   */
  protected async _handleHostDisconnected(): Promise<void> {
    if (this.isFullscreen) await this.exitFullscreen();
    this._listenerDisposal.empty();
  }

  /**
   * Whether fullscreen mode can be requested, generally is an API available to do so.
   */
  get isSupported(): boolean {
    return this.isSupportedNatively;
  }

  /**
   * Whether the native Fullscreen API is enabled/available.
   */
  get isSupportedNatively(): boolean {
    return fscreen.fullscreenEnabled;
  }

  /**
   * Whether the host element is in fullscreen mode.
   */
  get isFullscreen(): boolean {
    return this.isNativeFullscreen;
  }

  /**
   * Whether the host element is in fullscreen mode via the native Fullscreen API.
   */
  get isNativeFullscreen(): boolean {
    if (fscreen.fullscreenElement === this._host) return true;

    try {
      // Throws in iOS Safari...
      return this._host.matches(
        // TODO: `fullscreenPseudoClass` is missing from `@types/fscreen`.
        // @ts-expect-error
        fscreen.fullscreenPseudoClass
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * @param listener
   * @returns Stop listening function.
   */
  protected _addFullscreenChangeEventListener(
    listener: (this: HTMLElement, event: Event) => void
  ): () => void {
    if (!this.isSupported) return noop;

    if (DEV_MODE) {
      this._logger.debug('adding `fullscreenchange` listener');
    }

    // @ts-expect-error
    const dispose = listen(fscreen, 'fullscreenchange', listener);

    return () => {
      if (DEV_MODE) {
        this._logger.debug('removing `fullscreenchange` listener');
      }

      dispose();
    };
  }

  /**
   * @param listener
   * @returns Stop listening function.
   */
  protected _addFullscreenErrorEventListener(
    listener: (this: HTMLElement, event: Event) => void
  ): () => void {
    if (!this.isSupported) return noop;

    if (DEV_MODE) {
      this._logger.debug('adding `fullscreenerror` listener');
    }

    // @ts-expect-error
    const dispose = listen(fscreen, 'fullscreenerror', listener);

    return () => {
      if (DEV_MODE) {
        this._logger.debug('removing `fullscreenerror` listener');
      }

      dispose();
    };
  }

  async requestFullscreen(): Promise<void> {
    if (this.isFullscreen) return;

    this._throwIfNoFullscreenSupport();

    if (DEV_MODE) {
      this._logger.info('requesting fullscreen');
    }

    // TODO: Check if PiP is active, if so make sure to exit - need PiPController.

    this._listenerDisposal.add(
      this._addFullscreenChangeEventListener(
        this._handleFullscreenChange.bind(this)
      )
    );

    this._listenerDisposal.add(
      this._addFullscreenErrorEventListener(
        this._handleFullscreenError.bind(this)
      )
    );

    const response = await this._makeEnterFullscreenRequest();
    await this._lockScreenOrientation();
    return response;
  }

  protected async _makeEnterFullscreenRequest(): Promise<void> {
    this.isRequestingNativeFullscreen = true;
    const response = await fscreen.requestFullscreen(this._host);
    this.isRequestingNativeFullscreen = false;
    return response;
  }

  protected _handleFullscreenChange(event: Event) {
    if (!this.isFullscreen) this._listenerDisposal.empty();

    if (DEV_MODE) {
      this._logger
        .infoGroup('fullscreen change')
        .appendWithLabel('Event', event)
        .end();
    }

    this._host.dispatchEvent(
      vdsEvent('vds-fullscreen-change', {
        bubbles: true,
        composed: true,
        detail: this.isFullscreen,
        originalEvent: event
      })
    );
  }

  protected _handleFullscreenError(event: Event) {
    if (DEV_MODE) {
      this._logger
        .errorGroup('fullscreen error')
        .appendWithLabel('Event', event)
        .end();
    }

    this._host.dispatchEvent(
      vdsEvent('vds-fullscreen-error', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  async exitFullscreen(): Promise<void> {
    if (!this.isFullscreen) return;

    this._throwIfNoFullscreenSupport();

    if (DEV_MODE) {
      this._logger.info('exiting fullscreen');
    }

    const response = await this._makeExitFullscreenRequest();
    await this._unlockScreenOrientation();
    return response;
  }

  protected async _makeExitFullscreenRequest(): Promise<void> {
    return fscreen.exitFullscreen();
  }

  protected _shouldOrientScreen(): boolean {
    return (
      this._screenOrientationController.canOrient &&
      !isUndefined(this.screenOrientationLock)
    );
  }

  protected async _lockScreenOrientation(): Promise<void> {
    if (
      isUndefined(this.screenOrientationLock) ||
      !this._shouldOrientScreen()
    ) {
      return;
    }
    await this._screenOrientationController.lock(this.screenOrientationLock);
  }

  protected async _unlockScreenOrientation(): Promise<void> {
    if (!this._shouldOrientScreen()) return;
    await this._screenOrientationController.unlock();
  }

  /**
   * @throws {Error} - Will throw if Fullscreen API is not enabled or supported.
   */
  protected _throwIfNoFullscreenSupport() {
    if (this.isSupported) return;
    throw Error(
      'Fullscreen API is not enabled or supported in this environment.'
    );
  }
}
