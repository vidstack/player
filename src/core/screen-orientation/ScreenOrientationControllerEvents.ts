import { VdsCustomEvent } from '../../shared/events';
import { ScreenOrientation } from './ScreenOrientation';

export interface ScreenOrientationControllerEvents {
  'orientation-lock-change': VdsCustomEvent<boolean>;
  'orientation-change': VdsCustomEvent<ScreenOrientation>;
}
