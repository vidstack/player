import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { MediaElementProps } from './types';

export const mediaElementProps: CustomElementPropDefinitions<MediaElementProps> = {
  logLevel: { initial: 'silent' },
  load: { initial: 'visible' },
  autoplay: { initial: false },
  playsinline: { initial: false },
  poster: { initial: '' },
  loop: { initial: false },
  paused: { initial: true },
  volume: { initial: 1 },
  view: { initial: 'video' },
  muted: { initial: false },
  controls: { initial: false },
  currentTime: { initial: 0 },
  fullscreenOrientation: {},
  userIdleDelay: { initial: 2000 },
};
