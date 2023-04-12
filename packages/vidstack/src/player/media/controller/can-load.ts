import { effect, root, type ReadSignal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';

import { createIntersectionObserverAdapter } from '../../../foundation/observers/intersection-observer';
import type { MediaLoadingStrategy } from '../types';
import type { MediaControllerElement } from './types';

/**
 * This hook is responsible for determining when media can begin loading.
 */
export function useMediaCanLoad(
  $controller: ReadSignal<MediaControllerElement | null>,
  $load: ReadSignal<MediaLoadingStrategy>,
  callback: () => void,
) {
  if (__SERVER__) return;
  onConnect(async () => {
    const load = $load();
    if (load === 'eager') {
      requestAnimationFrame(callback);
    } else if (load === 'idle') {
      const { waitIdlePeriod } = await import('maverick.js/std');
      waitIdlePeriod(callback);
    } else if (load === 'visible') {
      root(async (dispose) => {
        const io = createIntersectionObserverAdapter($controller);
        effect(() => {
          if (io.intersecting) {
            callback();
            dispose();
          }
        });
      });
    }
  });
}
