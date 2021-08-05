import { VdsEvent } from '../events';
import { ScreenOrientation, ScreenOrientationLock } from './ScreenOrientation';

export type ScreenOrientationEvents = {
  'vds-screen-orientation-change': ScreenOrientationChangeEvent;
  'vds-screen-orientation-lock-change': ScreenOrientationLockChangeEvent;
};

/**
 * Fired when the current screen orientation changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ScreenOrientationChangeEvent = VdsEvent<ScreenOrientation>;

/**
 * Fired when the current screen orientation lock changes.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ScreenOrientationLockChangeEvent = VdsEvent<ScreenOrientationLock>;
