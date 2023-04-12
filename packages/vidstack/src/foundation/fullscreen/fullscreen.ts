import fscreen from 'fscreen';
import { effect, peek, signal, type ReadSignal } from 'maverick.js';
import { dispatchEvent, listenEvent } from 'maverick.js/std';

import type { FullscreenEventTarget } from './events';

export function createFullscreenAdapter(
  $target: ReadSignal<FullscreenEventTarget | null>,
): FullscreenAdapter {
  const $active = signal(false),
    exit = () => exitFullscreen(peek($target));

  // Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
  // listened to globally on the document so we need to know if they relate to the current host
  // element or not.
  let listening = false;

  effect(() => {
    const target = $target();

    if (target) {
      listenEvent(fscreen as any, 'fullscreenchange', async (trigger) => {
        const active = isFullscreen(target);
        if (active === $active()) return;
        if (!active) listening = false;
        $active.set(active);
        dispatchEvent(target, 'fullscreen-change', { detail: active, trigger });
      });

      listenEvent(fscreen as any, 'fullscreenerror', (trigger) => {
        if (!listening) return;
        dispatchEvent(target, 'fullscreen-error', { detail: null, trigger });
        listening = false;
      });

      return async () => {
        if (canFullscreen()) await exit();
      };
    }

    return;
  });

  return {
    get active() {
      return $active();
    },
    get supported() {
      return canFullscreen();
    },
    async enter() {
      try {
        listening = true;
        return await requestFullscreen(peek($target));
      } catch (error) {
        listening = false;
        throw error;
      }
    },
    exit,
  };
}

export function canFullscreen(): boolean {
  return fscreen.fullscreenEnabled;
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

async function requestFullscreen(host: HTMLElement | null): Promise<void> {
  if (!host || isFullscreen(host)) return;
  assertFullscreenAPI();
  return fscreen.requestFullscreen(host);
}

async function exitFullscreen(host: HTMLElement | null): Promise<void> {
  if (!host || !isFullscreen(host)) return;
  assertFullscreenAPI();
  return fscreen.exitFullscreen();
}

function assertFullscreenAPI() {
  if (canFullscreen()) return;
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
