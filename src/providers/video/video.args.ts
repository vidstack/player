import { FILE_PROVIDER_STORYBOOK_ARG_TYPES } from '../file';
import { VideoProviderProps } from './video.types';

export type VideoProviderStorybookArgs = {
  [P in keyof VideoProviderProps]: unknown;
};

export const VIDEO_PROVIDER_STORYBOOK_ARG_TYPES: Partial<VideoProviderStorybookArgs> = {
  ...FILE_PROVIDER_STORYBOOK_ARG_TYPES,
  autoPiP: {
    control: 'boolean',
    defaultValue: false,
  },
  controlsList: {
    control: 'text',
    defaultValue: undefined,
  },
  disablePiP: {
    control: 'boolean',
    defaultValue: false,
  },
  disableRemotePlayback: {
    control: 'boolean',
    defaultValue: false,
  },
  poster: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/poster.png',
  },
};
