import { VdsElement } from '../elements';
import { VdsCustomEvent } from '../events';
import { ScreenOrientation } from './ScreenOrientation';

export type ScreenOrientationHost = VdsElement;

export interface ScreenOrientationEvents {
	'orientation-lock-change': VdsCustomEvent<boolean>;
	'orientation-change': VdsCustomEvent<ScreenOrientation>;
}
