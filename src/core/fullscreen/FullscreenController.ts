import { Disposal, listenTo } from '@wcom/events';
import fscreen from 'fscreen';

import { WithEvents } from '../../shared/mixins/WithEvents';
import { Unsubscribe } from '../../shared/types';
import { isUndefined, noop } from '../../utils/unit';
import {
  ScreenOrientationController,
  ScreenOrientationLock,
} from '../screen-orientation';
import { FullscreenControllerEvents } from './FullscreenControllerEvents';
import { FullscreenControllerHost } from './FullscreenControllerHost';

/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement implements
 *   FullscreenControllerHost,
 *   ScreenOrientationControllerHost {
 *   fullscreenController = new FullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *   );
 *
 *   requestFullscreen(): Promise<void> {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   exitFullscreen(): Promise<void> {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class FullscreenController extends WithEvents<FullscreenControllerEvents>(
  class {},
) {
  protected disposal = new Disposal();

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
    protected host: FullscreenControllerHost,
    protected screenOrientationController: ScreenOrientationController,
  ) {
    super();

    const disconnectedCallback = host.disconnectedCallback;
    host.disconnectedCallback = async () => {
      await this.destroy();
      disconnectedCallback?.call(host);
    };
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
    if (fscreen.fullscreenElement === this.host) return true;

    try {
      // Throws in iOS Safari...
      return this.host.matches(
        // Property `fullscreenPseudoClass` is missing from `@types/fscreen`.
        ((fscreen as unknown) as { fullscreenPseudoClass: string })
          .fullscreenPseudoClass,
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Dispose of any event listeners and exit fullscreen (if active).
   */
  async destroy(): Promise<void> {
    if (this.isFullscreen) await this.exitFullscreen();
    this.disposal.empty();
    super.destroy();
  }

  protected addFullscreenChangeEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): Unsubscribe {
    if (!this.isSupported) return noop;
    return listenTo(
      (fscreen as unknown) as EventTarget,
      'fullscreenchange',
      handler,
    );
  }

  protected addFullscreenErrorEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): Unsubscribe {
    if (!this.isSupported) return noop;
    return listenTo(
      (fscreen as unknown) as EventTarget,
      'fullscreenerror',
      handler,
    );
  }

  async requestFullscreen(): Promise<void> {
    if (this.isFullscreen) return;

    this.throwIfNoFullscreenSupport();

    // TODO: Check if PiP is active, if so make sure to exit - need PipController.

    this.disposal.add(
      this.addFullscreenChangeEventListener(
        this.handleFullscreenChange.bind(this),
      ),
    );

    this.disposal.add(
      this.addFullscreenErrorEventListener(
        this.handleFullscreenError.bind(this),
      ),
    );

    const response = await this.makeEnterFullscreenRequest();
    await this.lockScreenOrientation();
    return response;
  }

  protected async makeEnterFullscreenRequest(): Promise<void> {
    this.isRequestingNativeFullscreen = true;
    const response = await fscreen.requestFullscreen(this.host);
    this.isRequestingNativeFullscreen = false;
    return response;
  }

  protected handleFullscreenChange(originalEvent: Event): void {
    if (!this.isFullscreen) this.disposal.empty();
    this.dispatchEvent('fullscreen-change', {
      detail: this.isFullscreen,
      originalEvent,
    });
  }

  protected handleFullscreenError(originalEvent: Event): void {
    this.dispatchEvent('error', { originalEvent });
  }

  async exitFullscreen(): Promise<void> {
    if (!this.isFullscreen) return;
    this.throwIfNoFullscreenSupport();
    const response = await this.makeExitFullscreenRequest();
    await this.unlockScreenOrientation();
    return response;
  }

  protected async makeExitFullscreenRequest(): Promise<void> {
    return fscreen.exitFullscreen();
  }

  protected shouldOrientScreen(): boolean {
    return (
      this.screenOrientationController.canOrient &&
      !isUndefined(this.screenOrientationLock)
    );
  }

  protected async lockScreenOrientation(): Promise<void> {
    if (!this.shouldOrientScreen()) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.screenOrientationController.lock(this.screenOrientationLock!);
  }

  protected async unlockScreenOrientation(): Promise<void> {
    if (!this.shouldOrientScreen()) return;
    await this.screenOrientationController.unlock();
  }

  protected throwIfNoFullscreenSupport(): void {
    if (this.isSupported) return;
    throw Error(
      'Fullscreen API is not enabled or supported in this environment.',
    );
  }
}
