import { VIDEO_PROVIDER_STORYBOOK_ARG_TYPES } from '../video';
import {
  VdsHlsEngineAttachEvent,
  VdsHlsEngineBuiltEvent,
  VdsHlsEngineDetachEvent,
  VdsHlsEngineNoSuppotEvent,
} from './hls.events';
import { HlsProviderActions, HlsProviderProps } from './hls.types';

export type HlsProviderStorybookArgs = {
  [P in keyof (HlsProviderProps & HlsProviderActions)]: unknown;
};

export const HLS_PROVIDER_STORYBOOK_ARG_TYPES: Partial<HlsProviderStorybookArgs> = {
  ...VIDEO_PROVIDER_STORYBOOK_ARG_TYPES,
  src: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/hls/index.m3u8',
  },
  libSrc: {
    control: 'text',
    defaultValue: 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.min.js',
  },
  onEngineBuilt: {
    action: VdsHlsEngineBuiltEvent.TYPE,
  },
  onEngineAttach: {
    action: VdsHlsEngineAttachEvent.TYPE,
  },
  onEngineDetach: {
    action: VdsHlsEngineDetachEvent.TYPE,
  },
  onEngineNoSupport: {
    action: VdsHlsEngineNoSuppotEvent.TYPE,
  },
};
