import { dispatchEvent } from 'maverick.js/std';

import type { ScreenOrientationEventTarget } from './events';
import type { ScreenOrientationLockType, ScreenOrientationType } from './screen-orientation';

export function dispatchOrientationChange(
  target: ScreenOrientationEventTarget | null,
  orientation: ScreenOrientationType,
  trigger?: Event,
) {
  dispatchEvent(target, 'orientation-change', {
    bubbles: true,
    composed: true,
    detail: orientation,
    trigger,
  });
}

export function dispatchLockChange(
  target: ScreenOrientationEventTarget | null,
  lockType: ScreenOrientationLockType,
) {
  dispatchEvent(target, 'orientation-lock-change', {
    bubbles: true,
    composed: true,
    detail: lockType,
  });
}
