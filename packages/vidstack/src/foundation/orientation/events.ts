import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType, ScreenOrientationType } from './types';

export interface ScreenOrientationEvents {
  'orientation-change': ScreenOrientationChangeEvent;
}

export interface ScreenOrientationChangeEventDetail {
  orientation: ScreenOrientationType;
  lock?: ScreenOrientationLockType;
}

/**
 * Fired when the current screen orientation changes.
 *
 * @detail orientation
 */
export interface ScreenOrientationChangeEvent
  extends DOMEvent<ScreenOrientationChangeEventDetail> {}
