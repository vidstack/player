import { VdsElement } from '../elements/index.js';
import { VdsCustomEvent } from '../events/index.js';
import { ScreenOrientation } from './ScreenOrientation.js';

export type ScreenOrientationHost = VdsElement;

export interface ScreenOrientationEvents {
	'orientation-lock-change': VdsCustomEvent<boolean>;
	'orientation-change': VdsCustomEvent<ScreenOrientation>;
}
