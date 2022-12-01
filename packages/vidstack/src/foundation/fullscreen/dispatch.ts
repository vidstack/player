import { dispatchEvent } from 'maverick.js/std';

export function dispatchFullscreenChange(
  target: EventTarget | null,
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

export function dispatchFullscreenError(target: EventTarget | null, triggerEvent?: Event) {
  dispatchEvent(target, 'vds-fullscreen-error', {
    detail: null,
    bubbles: true,
    composed: true,
    triggerEvent,
  });
}
