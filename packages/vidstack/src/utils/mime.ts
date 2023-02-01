import type { MediaSrc } from '../player/media/types';

// https://github.com/cookpete/react-player/blob/master/src/patterns.js#L16
export const AUDIO_EXTENSIONS =
  /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

// TODO: We'll need to extend this later.
export const AUDIO_TYPES = new Set<string>([
  'audio/mpeg',
  'audio/ogg',
  'audio/3gp',
  'audio/mp4',
  'audio/webm',
  'audio/flac',
]);

// https://github.com/cookpete/react-player/blob/master/src/patterns.js#L16
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;

// TODO: We'll need to extend this later.
export const VIDEO_TYPES = new Set<string>([
  'video/mp4',
  'video/webm',
  'video/3gp',
  'video/ogg',
  'video/avi',
  'video/mpeg',
]);

export const HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;

// Taken from video.js
export const HLS_VIDEO_TYPES = new Set<string>([
  // Apple sanctioned
  'application/vnd.apple.mpegurl',
  // Apple sanctioned for backwards compatibility
  'audio/mpegurl',
  // Very common
  'audio/x-mpegurl',
  // Very common
  'application/x-mpegurl',
  // Included for completeness
  'video/x-mpegurl',
  'video/mpegurl',
  'application/mpegurl',
]);

export function isHLSSrc({ src, type }: MediaSrc): boolean {
  return HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
}

export function inferSrcType(src: string): string {
  const ext = src.split('.').pop();
  if (AUDIO_EXTENSIONS.test(src)) return `audio/${ext}`;
  if (VIDEO_EXTENSIONS.test(src)) return `video/${ext}`;
  if (HLS_VIDEO_EXTENSIONS.test(src)) return 'application/x-mpegurl';
  return 'unknown';
}
