import { effect, ReadSignal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import { preconnect } from '../../../utils/network';
import { isHLSConstructorCached } from './loader';
import type { HLSLibrary } from './types';

export function useHLSPreconnect($library: ReadSignal<HLSLibrary>, logger?: Logger) {
  onConnect(() => {
    effect(() => {
      const lib = $library();

      if (isString(lib) && !isHLSConstructorCached(lib)) {
        if (__DEV__) {
          logger?.infoGroup('Pre-connecting `hls.js`').labelledLog('URL', lib).dispatch();
        }

        preconnect(lib);
      }
    });
  });
}
