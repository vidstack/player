import { createContext, createStore, useContext } from 'maverick.js';
import { keysOf } from 'maverick.js/std';

import { ATTEMPTING_AUTOPLAY, CAN_LOAD_POSTER, MediaState } from './state';
import { createTimeRanges } from './time-ranges';

export const MediaStateContext = createContext<MediaState>(() => mediaStore.create());

export function useMediaState(): Readonly<MediaState> {
  return useContext(MediaStateContext);
}

export function useInternalMediaState() {
  return useContext(MediaStateContext);
}

export const mediaStore = createStore<MediaState>({
  autoplay: false,
  autoplayError: undefined,
  buffered: createTimeRanges(),
  duration: 0,
  bufferedAmount: 0,
  canLoad: false,
  canPlay: false,
  canFullscreen: false,
  controls: false,
  poster: '',
  currentTime: 0,
  ended: false,
  error: undefined,
  fullscreen: false,
  userIdle: false,
  loop: false,
  live: false,
  mediaType: 'unknown',
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  seekable: createTimeRanges(),
  seekableAmount: 0,
  seeking: false,
  source: { src: '' },
  sources: [],
  started: false,
  viewType: 'unknown',
  volume: 1,
  waiting: false,
  [ATTEMPTING_AUTOPLAY]: false,
  [CAN_LOAD_POSTER]: true,
});

const DO_NOT_RESET_ON_SRC_CHANGE = new Set<keyof MediaState>([
  'autoplay',
  'canFullscreen',
  'canLoad',
  'controls',
  'loop',
  'muted',
  'playsinline',
  'poster',
  'source',
  'sources',
  'viewType',
  'volume',
]);

/**
 * Resets all media state and leaves general player state intact (i.e., `autoplay`, `volume`, etc.).
 */
export function softResetMediaState($media: MediaState) {
  for (const prop of keysOf(mediaStore.initial)) {
    if (!DO_NOT_RESET_ON_SRC_CHANGE.has(prop)) {
      $media[prop as any] = mediaStore.initial[prop];
    }
  }
}

export function hardResetMediaState($media: MediaState) {
  for (const prop of Object.keys(mediaStore.initial)) {
    $media[prop] = mediaStore.initial[prop];
  }
}
