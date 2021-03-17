import type Hls from 'hls.js';

import { ProviderActions } from '../../core';
import { Callback } from '../../shared/types';
import { VideoProviderProps } from '../video';

export interface HlsProviderProps extends VideoProviderProps {
  libSrc: string;
}

export interface HlsProviderActions extends ProviderActions {
  onEngineBuilt: Callback<CustomEvent>;
  onEngineAttach: Callback<CustomEvent>;
  onEngineDetach: Callback<CustomEvent>;
  onEngineNoSupport: Callback<CustomEvent>;
}

export type HlsProviderEngine = Hls | undefined;
