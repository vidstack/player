import { defineProp, ElementPropDefinitions } from 'maverick.js/element';

import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import type { MediaLoadingStrategy, MediaProviderProps } from './types';

export const mediaProviderPropDefs: ElementPropDefinitions<MediaProviderProps> = {
  logLevel: defineProp<LogLevel>('silent'),
  load: defineProp<MediaLoadingStrategy>('visible'),
  autoplay: { initial: false },
  playsinline: { initial: false },
  poster: { initial: '' },
  loop: { initial: false },
  paused: { initial: true },
  volume: { initial: 1 },
  muted: { initial: false },
  controls: { initial: false },
  currentTime: { initial: 0 },
  fullscreenOrientation: defineProp<ScreenOrientationLockType | undefined>(undefined),
};
