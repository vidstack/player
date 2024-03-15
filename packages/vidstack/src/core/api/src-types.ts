import { isNumber, isString } from 'maverick.js/std';
import type { SetRequired } from 'type-fest';

export type MediaSrc = string | AudioSrc | VideoSrc | HLSSrc | YouTubeSrc | VimeoSrc;

export type MediaSrcObject = MediaStream | MediaSource | Blob;

export type HTMLMediaSrc = string | MediaSrcObject;

export interface Src<T = unknown> {
  src: T;
  type: string;
}

export interface AudioSrc extends AudioSrcMeta {
  src: HTMLMediaSrc;
  type: AudioMimeType;
}

export type AudioMimeType =
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/3gp'
  | 'audio/mp4'
  | 'audio/webm'
  | 'audio/flac'
  | 'audio/object';

export interface AudioSrcMeta {
  id?: string;
  bitrate?: number;
  channels?: number;
}

export interface VideoSrc extends VideoSrcMeta {
  src: HTMLMediaSrc;
  type: VideoMimeType;
}

export type VideoMimeType =
  | 'video/mp4'
  | 'video/webm'
  | 'video/3gp'
  | 'video/ogg'
  | 'video/avi'
  | 'video/mpeg'
  | 'video/object';

export interface VideoSrcMeta {
  id?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  framerate?: number;
  codec?: string;
}

export interface HLSSrc {
  src: string;
  type: HLSMimeType;
}

export type HLSMimeType =
  | 'application/vnd.apple.mpegurl'
  | 'audio/mpegurl'
  | 'audio/x-mpegurl'
  | 'application/x-mpegurl'
  | 'video/x-mpegurl'
  | 'video/mpegurl'
  | 'application/mpegurl';

export interface YouTubeSrc {
  src: string;
  type: 'video/youtube';
}

export interface VimeoSrc {
  src: string;
  type: 'video/vimeo';
}

export function isVideoQualitySrc(src: Src): src is SetRequired<VideoSrc, 'width' | 'height'> {
  return (
    !isString(src) &&
    'width' in src &&
    'height' in src &&
    isNumber(src.width) &&
    isNumber(src.height)
  );
}
