import { dispatchEvent } from 'maverick.js/std';

import type { ScreenOrientationEventTarget } from './events';
import type { ScreenOrientationLockType, ScreenOrientationType } from './screen-orientation';

export function dispatchOrientationChange(
  target: ScreenOrientationEventTarget | null,
  orientation: ScreenOrientationType,
  triggerEvent?: Event,
) {
  dispatchEvent(target, 'vds-orientation-change', {
    bubbles: true,
    composed: true,
    detail: orientation,
    triggerEvent,
  });
}

export function dispatchLockChange(
  target: ScreenOrientationEventTarget | null,
  lockType: ScreenOrientationLockType,
) {
  dispatchEvent(target, 'vds-orientation-lock-change', {
    bubbles: true,
    composed: true,
    detail: lockType,
  });
}
