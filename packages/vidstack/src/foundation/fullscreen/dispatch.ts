import { dispatchEvent } from 'maverick.js/std';

import type { FullscreenEventTarget } from './events';

export function dispatchFullscreenChange(
  target: FullscreenEventTarget | null,
  isFullscreen: boolean,
  triggerEvent?: Event,
) {
  dispatchEvent(target, 'vds-fullscreen-change', {
    detail: isFullscreen,
    bubbles: true,
    composed: true,
    triggerEvent,
  });
}

export function dispatchFullscreenError(
  target: FullscreenEventTarget | null,
  triggerEvent?: Event,
) {
  dispatchEvent(target, 'vds-fullscreen-error', {
    detail: null,
    bubbles: true,
    composed: true,
    triggerEvent,
  });
}
