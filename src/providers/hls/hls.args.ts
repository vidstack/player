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
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8',
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
