import { dispatchEvent } from 'maverick.js/std';

import type { FullscreenEventTarget } from './events';

export function dispatchFullscreenChange(
  target: FullscreenEventTarget | null,
  isFullscreen: boolean,
  trigger?: Event,
) {
  dispatchEvent(target, 'fullscreen-change', {
    detail: isFullscreen,
    bubbles: true,
    composed: true,
    trigger,
  });
}

export function dispatchFullscreenError(target: FullscreenEventTarget | null, trigger?: Event) {
  dispatchEvent(target, 'fullscreen-error', {
    detail: null,
    bubbles: true,
    composed: true,
    trigger,
  });
}
