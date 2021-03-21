import { PROVIDER_STORYBOOK_ARG_TYPES } from '../../core';
import { FileProviderProps } from './file.types';

export type FileProviderStorybookArgs = {
  [P in keyof FileProviderProps]: unknown;
};

export const FILE_PROVIDER_STORYBOOK_ARG_TYPES = {
  ...PROVIDER_STORYBOOK_ARG_TYPES,
  src: {
    control: 'text',
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4',
  },
  controlsList: {
    control: 'text',
    defaultValue: undefined,
  },
  crossOrigin: {
    control: {
      type: 'select',
      options: ['anonymous', 'use-credentials'],
    },
    defaultValue: 'anonymous',
  },
  disableRemotePlayback: {
    control: 'boolean',
    defaultValue: false,
  },
  height: {
    control: 'number',
  },
  preload: {
    control: {
      type: 'select',
      options: ['none', 'metadata', 'auto'],
    },
    defaultValue: 'metadata',
  },
  width: {
    control: 'number',
  },
};
