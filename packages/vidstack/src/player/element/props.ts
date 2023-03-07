import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { MEDIA_KEY_SHORTCUTS } from './keyboard';
import type { MediaPlayerProps } from './types';

export const mediaPlayerProps: CustomElementPropDefinitions<MediaPlayerProps> = {
  autoplay: { initial: false },
  aspectRatio: {
    initial: null,
    type: {
      from(value) {
        if (!value) return null;
        const [width, height] = value.split('/').map(Number);
        return +(width / height).toFixed(4);
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
  playbackRate: { initial: 1 },
  poster: { initial: '' },
  preload: { initial: 'metadata' },
  preferNativeHLS: {
    initial: false,
    attribute: 'prefer-native-hls',
  },
  src: { initial: '' },
  userIdleDelay: { initial: 2000 },
  viewType: { initial: 'unknown' },
  streamType: { initial: 'unknown' },
  volume: { initial: 1 },
  liveEdgeTolerance: { initial: 10 },
  minLiveDVRWindow: { initial: 60 },
  keyDisabled: { initial: false },
  keyTarget: { initial: 'player' },
  keyShortcuts: { initial: MEDIA_KEY_SHORTCUTS },
};
