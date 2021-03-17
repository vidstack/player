import { PROVIDER_STORYBOOK_ARG_TYPES } from '../../core';
import { FileProviderProps } from './file.types';

export type FileProviderStorybookArgs = {
  [P in keyof FileProviderProps]: unknown;
};

export const FILE_PROVIDER_STORYBOOK_ARG_TYPES = {
  ...PROVIDER_STORYBOOK_ARG_TYPES,
  src: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/720p.mp4',
  },
  width: {
    control: 'number',
  },
  height: {
    control: 'number',
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
};
