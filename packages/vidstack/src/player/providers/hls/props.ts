import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { videoProviderProps } from '../video/props';
import type { HLSProviderProps } from './types';

export const hlsVideoProviderProps: CustomElementPropDefinitions<HLSProviderProps> = {
  ...videoProviderProps,
  hlsConfig: { initial: {} },
  hlsLibrary: {
    initial: `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light${
      __DEV__ ? '.js' : '.min.js'
    }`,
  },
};
