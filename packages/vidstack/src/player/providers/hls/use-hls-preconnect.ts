import { effect } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import { preconnect } from '../../../utils/network';
import { isHLSConstructorCached } from './loader';
import type { HLSProviderProps } from './types';

export function useHLSPreconnect(props: HLSProviderProps, logger?: Logger) {
  onConnect(() => {
    effect(() => {
      if (isString(props.hlsLibrary) && !isHLSConstructorCached(props.hlsLibrary)) {
        if (__DEV__) {
          logger
            ?.infoGroup('Pre-connecting `hls.js`')
            .labelledLog('URL', props.hlsLibrary)
            .dispatch();
        }

        preconnect(props.hlsLibrary);
      }
    });
  });
}
