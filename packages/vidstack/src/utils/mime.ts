import type { MediaType } from '../player/media/types';

export const AUDIO_EXTENSIONS =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|avi)($|\?)/i;

export function getMediaTypeFromExt(src: string): MediaType {
  if (AUDIO_EXTENSIONS.test(src)) return 'audio';
  if (VIDEO_EXTENSIONS.test(src)) return 'video';
  return 'unknown';
}
