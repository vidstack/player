import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType, ScreenOrientationType } from './screen-orientation';

declare global {
  interface MaverickOnAttributes extends ScreenOrientationEvents {}
}

export type ScreenOrientationEvents = {
  'vds-orientation-change': ScreenOrientationChangeEvent;
  'vds-orientation-lock-change': ScreenOrientationLockChangeEvent;
};

/**
 * Fired when the current screen orientation changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ScreenOrientationChangeEvent = DOMEvent<ScreenOrientationType>;

/**
 * Fired when the current screen orientation lock changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ScreenOrientationLockChangeEvent = DOMEvent<ScreenOrientationLockType>;
