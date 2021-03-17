import type Hls from 'hls.js';

import { Callback } from '../../shared/types';
import { VideoProviderActions, VideoProviderProps } from '../video';

export interface HlsProviderProps extends VideoProviderProps {
  libSrc: string;
}

export interface HlsProviderActions extends VideoProviderActions {
  onEngineBuilt: Callback<CustomEvent>;
  onEngineAttach: Callback<CustomEvent>;
  onEngineDetach: Callback<CustomEvent>;
  onEngineNoSupport: Callback<CustomEvent>;
}

export type HlsProviderEngine = Hls | undefined;
