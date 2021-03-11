import { PROVIDER_ARG_TYPES, ProviderArgTypes } from '../../core';
import { MediaCrossOriginOption, MediaPreloadOption } from '../file';
import { VideoControlsList } from './video.types';

export interface VideoArgTypes extends ProviderArgTypes {
  width: number;
  height: number;
  src: string;
  poster: string;
  crossOrigin: MediaCrossOriginOption;
  preload: MediaPreloadOption;
  controlsList?: VideoControlsList;
  autoPiP: boolean;
  disablePiP: boolean;
  disableRemotePlayback: boolean;
}

export const VIDEO_ARG_TYPES = {
  ...PROVIDER_ARG_TYPES,
  width: {
    control: 'number',
  },
  height: {
    control: 'number',
  },
  src: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/720p.mp4',
  },
  poster: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/poster.png',
  },
  crossOrigin: {
    control: {
      type: 'select',
      options: ['anonymous', 'use-credentials'],
    },
    defaultValue: 'anonymous',
  },
  preload: {
    control: {
      type: 'select',
      options: ['none', 'metadata', 'auto'],
    },
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
