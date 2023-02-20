import { createStore, tick } from 'maverick.js';

import type { MediaState } from './state';
import { createTimeRanges } from './time-ranges';

export interface MediaStore extends MediaState {}

export const mediaStore = createStore<MediaStore>({
  autoplay: false,
  autoplayError: undefined,
  buffered: createTimeRanges(),
  duration: 0,
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
  logLevel: __DEV__ ? 'warn' : 'silent',
  media: 'unknown',
  muted: false,
  paused: true,
  played: createTimeRanges(),
  playing: false,
  playsinline: false,
  preload: 'metadata',
  seekable: createTimeRanges(),
  seeking: false,
  source: { src: '', type: '' },
  sources: [],
  started: false,
  view: 'video',
  volume: 1,
  waiting: false,
  get currentSrc() {
    return this.source;
  },
  get bufferedAmount() {
    const buffered = this.buffered;
    return buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
  },
  get seekableStart() {
    const seekable: TimeRanges = this.seekable;
    return seekable.length ? seekable.start(0) : 0;
  },
  get seekableEnd() {
    const seekable: TimeRanges = this.seekable;
    return seekable.length ? seekable.end(seekable.length - 1) : Infinity;
  },
  // internal
  attemptingAutoplay: false,
  canLoadPoster: null,
});

const DO_NOT_RESET_ON_SRC_CHANGE = new Set<keyof MediaStore>([
  'autoplay',
  'canFullscreen',
  'canLoad',
  'controls',
  'loop',
  'logLevel',
  'muted',
  'playsinline',
  'preload',
  'poster',
  'source',
  'sources',
  'view',
  'volume',
  'canLoadPoster',
]);

/**
 * Resets all media state and leaves general player state intact (i.e., `autoplay`, `volume`, etc.).
 */
export function softResetMediaStore($media: MediaStore) {
  mediaStore.reset($media, (prop) => !DO_NOT_RESET_ON_SRC_CHANGE.has(prop));
  tick();
}
