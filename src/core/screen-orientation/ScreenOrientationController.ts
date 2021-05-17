import { DisposalBin, listen } from '../../shared/events';
import { WithEvents } from '../../shared/mixins/WithEvents';
import { Unsubscribe } from '../../shared/types.utils';
import { canOrientScreen, IS_CLIENT } from '../../utils/support';
import { ScreenOrientation, ScreenOrientationLock } from './ScreenOrientation';
import { ScreenOrientationControllerEvents } from './ScreenOrientationControllerEvents';
import { ScreenOrientationControllerHost } from './ScreenOrientationControllerHost';

/**
 * Contains the logic for managing the window's screen orientation.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement implements ScreenOrientationControllerHost {
 *   screenOrientationController = new ScreenOrientationController(this);
 * }
 * ```
 */
export class ScreenOrientationController extends WithEvents<ScreenOrientationControllerEvents>(
  class {},
) {
  protected disposal = new DisposalBin();

  protected screenOrientation?: ScreenOrientation;

  protected isScreenOrientationLocked = false;

  constructor(private host: ScreenOrientationControllerHost) {
    super();

    this.updateScreenOrientation();

    const connectedCallback = host.connectedCallback;
    host.connectedCallback = () => {
      this.updateScreenOrientation();
      this.addScreenOrientationEventListeners();
      connectedCallback?.call(host);
    };

    const disconnectedCallback = host.disconnectedCallback;
    host.disconnectedCallback = async () => {
      await this.destroy();
      disconnectedCallback?.call(host);
    };
  }

  /**
   * The current screen orientation. It will return `undefined` if the Screen Orientation API
   * is not available.
   *
   * @default undefined
   */
  get currentOrientation(): ScreenOrientation | undefined {
    return this.screenOrientation;
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
    return this.isScreenOrientationLocked;
  }

  /**
   * Locks the orientation of the player to the desired orientation type using the
   * Screen Orientation API. This method will throw an error if the API is unavailable.
   *
   * @param lockType - The screen lock orientation type.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  async lock(lockType: ScreenOrientationLock): Promise<void> {
    this.throwIfScreenOrientationUnavailable();
    await screen.orientation.lock(lockType);
    this.isScreenOrientationLocked = true;
    this.dispatchEvent('orientation-lock-change', {
      detail: true,
    });
  }

  /**
   * Unlocks the orientation of the player to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   * @spec https://w3c.github.io/screen-orientation
   */
  async unlock(): Promise<void> {
    this.throwIfScreenOrientationUnavailable();
    await screen.orientation.unlock();
    this.isScreenOrientationLocked = false;
    this.dispatchEvent('orientation-lock-change', {
      detail: false,
    });
  }

  /**
   * Dispose of any event listeners and unlock screen orientation (if locked).
   */
  async destroy(): Promise<void> {
    if (this.canOrient && this.isScreenOrientationLocked) await this.unlock();
    this.disposal.empty();
    super.destroy();
  }

  protected addScreenOrientationEventListeners(): void {
    if (!this.canOrient) return;
    this.disposal.add(this.addScreenOrientationChangeEventListener());
  }

  protected addScreenOrientationChangeEventListener(): Unsubscribe {
    return listen(
      screen.orientation,
      'change',
      this.handleOrientationChange.bind(this),
    );
  }

  protected handleOrientationChange(): void {
    this.screenOrientation = window.screen.orientation
      .type as ScreenOrientation;

    this.dispatchEvent('orientation-change', {
      detail: this.screenOrientation,
    });
  }

  protected updateScreenOrientation(): void {
    this.screenOrientation = IS_CLIENT
      ? (window.screen?.orientation?.type as ScreenOrientation)
      : undefined;
  }

  protected throwIfScreenOrientationUnavailable(): void {
    if (this.canOrient) return;
    throw Error('Screen orientation API is not available.');
  }
}
