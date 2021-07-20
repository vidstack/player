import { VdsCustomEvent } from '../events/index.js';
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
export class ScreenOrientationChangeEvent extends ScreenOrientationEvent {}
/** @readonly */
ScreenOrientationChangeEvent.TYPE = 'vds-screen-orientation-change';
/**
 * Fired when the current screen orientation lock changes.
 *
 * @augments {ScreenOrientationEvent<ScreenOrientationLock>}
 */
export class ScreenOrientationLockChangeEvent extends ScreenOrientationEvent {}
/** @readonly */
ScreenOrientationLockChangeEvent.TYPE = 'vds-screen-orientation-lock-change';
