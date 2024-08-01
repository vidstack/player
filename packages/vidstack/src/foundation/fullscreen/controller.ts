import fscreen from 'fscreen';
import { onDispose, ViewController } from 'maverick.js';
import { EventsController, listenEvent } from 'maverick.js/std';

import type { FullscreenEvents } from './events';

const CAN_FULLSCREEN = fscreen.fullscreenEnabled;

export class FullscreenController
  extends ViewController<{}, {}, FullscreenEvents>
  implements FullscreenAdapter
{
  /**
   * Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
   * listened to globally on the document so we need to know if they relate to the current host
   * element or not.
   */
  #listening = false;

  #active = false;

  get active() {
    return this.#active;
  }

  get supported() {
    return CAN_FULLSCREEN;
  }

  protected override onConnect() {
    new EventsController(fscreen as unknown as EventTarget)
      .add('fullscreenchange', this.#onChange.bind(this))
      .add('fullscreenerror', this.#onError.bind(this));

    onDispose(this.#onDisconnect.bind(this));
  }

  async #onDisconnect() {
    if (CAN_FULLSCREEN) await this.exit();
  }

  #onChange(event: Event) {
    const active = isFullscreen(this.el);
    if (active === this.#active) return;
    if (!active) this.#listening = false;
    this.#active = active;
    this.dispatch('fullscreen-change', { detail: active, trigger: event });
  }

  #onError(event: Event) {
    if (!this.#listening) return;
    this.dispatch('fullscreen-error', { detail: null, trigger: event });
    this.#listening = false;
  }

  async enter() {
    try {
      this.#listening = true;
      if (!this.el || isFullscreen(this.el)) return;
      assertFullscreenAPI();
      return fscreen.requestFullscreen(this.el);
    } catch (error) {
      this.#listening = false;
      throw error;
    }
  }

  async exit() {
    if (!this.el || !isFullscreen(this.el)) return;
    assertFullscreenAPI();
    return fscreen.exitFullscreen();
  }
}

export function canFullscreen(): boolean {
  return CAN_FULLSCREEN;
}

function isFullscreen(host?: HTMLElement | null): boolean {
  if (fscreen.fullscreenElement === host) return true;
  try {
    // Throws in iOS Safari...
    return host!.matches(
      // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
      fscreen.fullscreenPseudoClass,
    );
  } catch (error) {
    return false;
  }
}

function assertFullscreenAPI() {
  if (CAN_FULLSCREEN) return;
  throw Error(
    __DEV__
      ? '[vidstack] fullscreen API is not enabled or supported in this environment'
      : '[vidstack] no fullscreen API',
  );
}

export interface FullscreenAdapter {
  /**
   * Whether the host element is in fullscreen mode.
   */
  readonly active: boolean;
  /**
   * Whether the native browser fullscreen API is available, or the current provider can
   * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
   * only that it can be attempted.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  readonly supported: boolean;
  /**
   * Request to display the current host element in fullscreen.
   *
   * @throws Error - if fullscreen API is not available.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen}
   */
  enter(): Promise<void>;
  /**
   * Attempt to exit fullscreen on the current host element.
   *
   * @throws Error - if fullscreen API is not available.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen}
   */
  exit(): Promise<void>;
}
