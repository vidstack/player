import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { MediaProviderProps } from './types';

export const mediaProviderPropDefs: CustomElementPropDefinitions<MediaProviderProps> = {
  logLevel: { initial: 'silent' },
  load: { initial: 'visible' },
  autoplay: { initial: false },
  playsinline: { initial: false },
  poster: { initial: '' },
  loop: { initial: false },
  paused: { initial: true },
  volume: { initial: 1 },
  muted: { initial: false },
  controls: { initial: false },
  currentTime: { initial: 0 },
  fullscreenOrientation: {},
};
