import { MediaCrossOriginOption, MediaPreloadOption } from '../file';
import { VideoControlsList } from './video.types';

export interface VideoArgTypes {
  width: number;
  height: number;
  aspectRatio: string;
  src: string;
  poster: string;
  paused: boolean;
  volume: number;
  currentTime: number;
  muted: boolean;
  playsinline: boolean;
  loop: boolean;
  controls: boolean;
  crossOrigin: MediaCrossOriginOption;
  preload: MediaPreloadOption;
  controlsList?: VideoControlsList;
  autoPiP: boolean;
  disablePiP: boolean;
  disableRemotePlayback: boolean;
}

export const VIDEO_ARG_TYPES = {
  width: {
    control: 'number',
  },
  height: {
    control: 'number',
  },
  aspectRatio: {
    control: 'text',
  },
  src: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/720p.mp4',
  },
  poster: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/poster.png',
  },
  paused: {
    control: 'boolean',
    defaultValue: true,
  },
  volume: {
    control: {
      type: 'number',
      step: 0.01,
    },
    defaultValue: 1,
  },
  currentTime: {
    control: 'number',
    defaultValue: 0,
  },
  muted: {
    control: 'boolean',
    defaultValue: false,
  },
  playsinline: {
    control: 'boolean',
    defaultValue: false,
  },
  loop: {
    control: 'boolean',
    defaultValue: false,
  },
  controls: {
    control: 'boolean',
    defaultValue: false,
  },
  crossOrigin: {
    control: 'text',
    defaultValue: 'anonymous',
  },
  preload: {
    control: 'text',
    defaultValue: 'metadata',
  },
  controlsList: {
    control: 'text',
    defaultValue: undefined,
  },
  autoPiP: {
    control: 'boolean',
    defaultValue: false,
  },
  disablePiP: {
    control: 'boolean',
    defaultValue: false,
  },
  disableRemotePlayback: {
    control: 'boolean',
    defaultValue: false,
  },
};
