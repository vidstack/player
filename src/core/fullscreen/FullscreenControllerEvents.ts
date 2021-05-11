import { VdsCustomEvent } from '../../shared/events';

export interface FullscreenControllerEvents {
  'fullscreen-change': VdsCustomEvent<boolean>;
  error: VdsCustomEvent<void>;
}
