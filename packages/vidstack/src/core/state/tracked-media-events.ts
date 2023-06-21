import type { MediaEvents } from '../api/media-events';

export const TRACKED_EVENT = new Set<keyof MediaEvents>([
  'autoplay',
  'autoplay-fail',
  'can-load',
  'sources-change',
  'source-change',
  'load-start',
  'abort',
  'error',
  'loaded-metadata',
  'loaded-data',
  'can-play',
  'play',
  'play-fail',
  'pause',
  'playing',
  'seeking',
  'seeked',
  'waiting',
]);
