import { ProviderActions } from '../../core';
import { Callback } from '../../shared/types';
import {
  VIDEO_PROVIDER_STORYBOOK_ARG_TYPES,
  VideoProviderProps,
} from '../video';
import {
  HlsEngineAttachEvent,
  HlsEngineBuiltEvent,
  HlsEngineDetachEvent,
  HlsEngineNoSuppotEvent,
} from './hls.events';

export interface HlsProviderProps extends VideoProviderProps {
  libSrc: string;
}

export interface HlsProviderActions extends ProviderActions {
  onEngineBuilt: Callback<CustomEvent>;
  onEngineAttach: Callback<CustomEvent>;
  onEngineDetach: Callback<CustomEvent>;
  onEngineNoSupport: Callback<CustomEvent>;
}

export type HlsProviderStorybookArgs = {
  [P in keyof HlsProviderProps & HlsProviderActions]: unknown;
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
    action: HlsEngineBuiltEvent.TYPE,
  },
  onEngineAttach: {
    action: HlsEngineAttachEvent.TYPE,
  },
  onEngineDetach: {
    action: HlsEngineDetachEvent.TYPE,
  },
  onEngineNoSupport: {
    action: HlsEngineNoSuppotEvent.TYPE,
  },
};
