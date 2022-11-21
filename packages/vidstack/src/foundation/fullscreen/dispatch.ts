import { dispatchEvent } from 'maverick.js/std';

export function dispatchFullscreenChange(
  target: EventTarget | null,
  isFullscreen: boolean,
  triggerEvent?: Event,
) {
  dispatchEvent(target, 'vds-fullscreen-change', {
    bubbles: true,
    composed: true,
    detail: isFullscreen,
    triggerEvent,
  });
}

export function dispatchFullscreenError(target: EventTarget | null, triggerEvent?: Event) {
  dispatchEvent(target, 'vds-fullscreen-error', {
    bubbles: true,
    composed: true,
    triggerEvent,
  });
}
