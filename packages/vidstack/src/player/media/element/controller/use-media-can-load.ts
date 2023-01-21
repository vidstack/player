import { effect, ReadSignal, root } from 'maverick.js';
import { onConnect } from 'maverick.js/element';

import { useIntersectionObserver } from '../../../../foundation/observers/use-intersection-observer';
import type { MediaElement } from '../../element/types';
import type { MediaLoadingStrategy } from '../../types';

/**
 * This hook is responsible for determining when media can begin loading.
 */
export function useMediaCanLoad(
  $target: ReadSignal<MediaElement | null>,
  $load: ReadSignal<MediaLoadingStrategy>,
  startLoadingMedia: () => void,
) {
  onConnect(async () => {
    const load = $load();

    if (load === 'eager') {
      requestAnimationFrame(startLoadingMedia);
    } else if (load === 'idle') {
      const { waitIdlePeriod } = await import('maverick.js/std');
      waitIdlePeriod(startLoadingMedia);
    } else if (load === 'visible') {
      root(async (dispose) => {
        const io = useIntersectionObserver($target);
        effect(() => {
          if (io.intersecting) {
            startLoadingMedia();
            dispose();
          }
        });
      });
    }
  });
}
