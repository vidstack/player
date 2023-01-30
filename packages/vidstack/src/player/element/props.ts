import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { MediaPlayerProps } from './types';

export const mediaPlayerProps: CustomElementPropDefinitions<MediaPlayerProps> = {
  autoplay: { initial: false },
  aspectRatio: {
    initial: null,
    type: {
      from(value) {
        if (!value) return null;
        const [width, height] = value.split('/').map(Number);
        return width / height;
      },
    },
  },
  controls: { initial: false },
  currentTime: { initial: 0 },
  fullscreenOrientation: {},
  load: { initial: 'visible' },
  logLevel: { initial: 'silent' },
  loop: { initial: false },
  muted: { initial: false },
  paused: { initial: true },
  playsinline: { initial: false },
  poster: { initial: '' },
  preload: { initial: 'metadata' },
  src: { initial: '' },
  userIdleDelay: { initial: 2000 },
  view: { initial: 'video' },
  volume: { initial: 1 },
};
