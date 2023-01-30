import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType, ScreenOrientationType } from './types';

export interface ScreenOrientationEventTarget
  extends HTMLCustomElement<any, ScreenOrientationEvents> {}

export interface ScreenOrientationEvents {
  'orientation-change': ScreenOrientationChangeEvent;
}

export interface ScreenOrientationChangeEventDetail {
  orientation: ScreenOrientationType;
  lock?: ScreenOrientationLockType;
}

/**
 * Fired when the current screen orientation changes.
 */
export interface ScreenOrientationChangeEvent
  extends DOMEvent<ScreenOrientationChangeEventDetail> {}
