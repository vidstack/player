import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType, ScreenOrientationType } from './screen-orientation';

export interface ScreenOrientationEventTarget
  extends HTMLCustomElement<any, ScreenOrientationEvents> {}

export interface ScreenOrientationEvents {
  'vds-orientation-change': ScreenOrientationChangeEvent;
  'vds-orientation-lock-change': ScreenOrientationLockChangeEvent;
}

/**
 * Fired when the current screen orientation changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export interface ScreenOrientationChangeEvent extends DOMEvent<ScreenOrientationType> {}

/**
 * Fired when the current screen orientation lock changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export interface ScreenOrientationLockChangeEvent extends DOMEvent<ScreenOrientationLockType> {}
