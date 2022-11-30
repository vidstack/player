import { effect, observable, root } from 'maverick.js';
import { ElementInstanceHost, onConnect } from 'maverick.js/element';
import { dispatchEvent, waitAnimationFrame, waitIdlePeriod } from 'maverick.js/std';

import { useIntersectionObserver } from '../../../foundation/observers/use-intersection-observer';
import type { MediaProviderProps } from './types';

/**
 * This hook is responsible for initializing and updating the media `canPlay` state.
 */
export function useMediaCanLoad(host: ElementInstanceHost, $provider: MediaProviderProps) {
  const $canLoad = observable(false);

  onConnect(() => {
    if ($provider.load === 'eager') {
      waitAnimationFrame(startLoadingMedia);
    } else if ($provider.load === 'idle') {
      waitIdlePeriod(startLoadingMedia);
    } else if ($provider.load === 'visible') {
      root((dispose) => {
        const io = useIntersectionObserver({ $target: () => host.el });
        effect(() => {
          if (io.intersecting) {
            startLoadingMedia();
            dispose();
          }
        });
      });
    }
  });

  function startLoadingMedia() {
    $canLoad.set(true);
    dispatchEvent(host.el, 'vds-can-load');
  }

  return { $canLoad, startLoadingMedia };
}
