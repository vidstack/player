import fscreen from 'fscreen';
import { observable } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { listenEvent, useHost } from 'maverick.js/std';

import { dispatchFullscreenChange, dispatchFullscreenError } from './dispatch';

export function useFullscreen(props?: UseFullscreenProps): UseFullscreen {
  const host = useHost(),
    $active = observable(false),
    exit = () => exitFullscreen(host.el, props);

  // Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
  // listened to globally on the document so we need to know if they relate to the current host
  // element or not.
  let listening = false;

  onConnect(() => {
    listenEvent(fscreen as any, 'fullscreenchange', async (event) => {
      const current = isFullscreen(host.el!);
      if (current === $active()) return;
      if (!current) listening = false;
      $active.set(current);
      dispatchFullscreenChange(host.el, current, event);
    });

    listenEvent(fscreen as any, 'fullscreenerror', (event) => {
      if (!listening) return;
      dispatchFullscreenError(host.el, event);
      listening = false;
    });

    return async () => {
      if (canFullscreen()) await exit();
    };
  });

  return {
    get active() {
      return $active();
    },
    get supported() {
      return canFullscreen();
    },
    async requestFullscreen() {
      try {
        listening = true;
        return await requestFullscreen(host.el, props);
      } catch (error) {
        listening = false;
        throw error;
      }
    },
    exitFullscreen: exit,
  };
}

function canFullscreen(): boolean {
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

async function requestFullscreen(
  host: HTMLElement | null,
  options?: UseFullscreenProps,
): Promise<void> {
  if (!host || isFullscreen(host)) return;
  assertFullscreenAPI();
  await options?.onBeforeRequest?.();
  return fscreen.requestFullscreen(host);
}

async function exitFullscreen(
  host: HTMLElement | null,
  options?: UseFullscreenProps,
): Promise<void> {
  if (!host || !isFullscreen(host)) return;
  assertFullscreenAPI();
  await options?.onBeforeExit?.();
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

export type UseFullscreen = {
  /**
   * Whether the host element is in fullscreen mode.
   *
   * @observable
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
  requestFullscreen(): Promise<void>;
  /**
   * Attempt to exit fullscreen on the current host element.
   *
   * @throws Error - if fullscreen API is not available.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen}
   */
  exitFullscreen(): Promise<void>;
};

export type UseFullscreenProps = {
  onBeforeRequest?: () => Promise<void>;
  onBeforeExit?: () => Promise<void>;
};
