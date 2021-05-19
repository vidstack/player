import { VdsElement } from '../../shared/elements';
import { VdsCustomEvent } from '../../shared/events';

export type ScreenOrientationControllerHost = VdsElement;

export interface ScreenOrientationControllerEvents {
	'orientation-lock-change': VdsCustomEvent<boolean>;
	'orientation-change': VdsCustomEvent<ScreenOrientation>;
}
