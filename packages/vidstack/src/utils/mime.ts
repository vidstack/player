import type { MediaSrc, MediaType } from '../player/media/types';

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|avi)($|\?)/i;

// TODO: also test source type
export function getMediaTypeFromExt(source: MediaSrc): MediaType {
  if (AUDIO_EXTENSIONS.test(source.src)) return 'audio';
  if (VIDEO_EXTENSIONS.test(source.src) || HLS_VIDEO_EXTENSIONS.test(source.src)) return 'video';
  return 'unknown';
}

export const HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;

// Taken from video.js
export const HLS_VIDEO_TYPES = new Set([
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
