import { VdsCustomEvent } from '../events/index.js';
import {
  ScreenOrientation,
  ScreenOrientationLock
} from './ScreenOrientation.js';

/**
 * @typedef {{
 *   [ScreenOrientationChangeEvent.TYPE]: ScreenOrientationChangeEvent;
 *   [ScreenOrientationLockChangeEvent.TYPE]: ScreenOrientationLockChangeEvent;
 * }} ScreenOrientationEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ScreenOrientationEvent extends VdsCustomEvent {}

/**
 * Fired when the current screen orientation changes.
 *
 * @augments {ScreenOrientationEvent<ScreenOrientation>}
 */
export class ScreenOrientationChangeEvent extends ScreenOrientationEvent {
  /** @readonly */
  static TYPE = 'vds-screen-orientation-change';
}

/**
 * Fired when the current screen orientation lock changes.
 *
 * @augments {ScreenOrientationEvent<ScreenOrientationLock>}
 */
export class ScreenOrientationLockChangeEvent extends ScreenOrientationEvent {
  /** @readonly */
  static TYPE = 'vds-screen-orientation-lock-change';
}
