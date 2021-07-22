import { VdsEvent } from '../events/index.js';
import {
  ScreenOrientation,
  ScreenOrientationLock
} from './ScreenOrientation.js';

/**
 * @typedef {{
 *   'vds-screen-orientation-change': ScreenOrientationChangeEvent;
 *   'vds-screen-orientation-lock-change': ScreenOrientationLockChangeEvent;
 * }} ScreenOrientationEvents
 */

/**
 * Fired when the current screen orientation changes.
 *
 * @event
 * @typedef {VdsEvent<ScreenOrientation>} ScreenOrientationChangeEvent
 */

/**
 * Fired when the current screen orientation lock changes.
 *
 * @event
 * @typedef {VdsEvent<ScreenOrientationLock>} ScreenOrientationLockChangeEvent
 */
