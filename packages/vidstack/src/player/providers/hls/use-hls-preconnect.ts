import { effect, ReadSignal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import { preconnect } from '../../../utils/network';
import { isHLSConstructorCached } from './loader';
import type { HLSLibrary } from './types';

export function useHLSPreconnect($hlsLibrary: ReadSignal<HLSLibrary>, logger?: Logger) {
  onConnect(() => {
    effect(() => {
      const hlsLibrary = $hlsLibrary();

      if (isString(hlsLibrary) && !isHLSConstructorCached(hlsLibrary)) {
        if (__DEV__) {
          logger?.infoGroup('Pre-connecting `hls.js`').labelledLog('URL', hlsLibrary).dispatch();
        }

        preconnect(hlsLibrary);
      }
    });
  });
}
