import type { MediaEvents } from '../api/media-events';

export const TRACKED_EVENT = new Set<keyof MediaEvents>([
  'auto-play',
  'auto-play-fail',
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
