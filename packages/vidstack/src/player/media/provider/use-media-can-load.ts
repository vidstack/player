import { effect, ReadSignal, root } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { dispatchEvent, waitAnimationFrame, waitIdlePeriod } from 'maverick.js/std';

import { useIntersectionObserver } from '../../../foundation/observers/use-intersection-observer';
import type { MediaProviderElement, MediaProviderProps } from './types';

/**
 * This hook is responsible for determining when media can begin loading.
 */
export function useMediaCanLoad(
  $target: ReadSignal<MediaProviderElement | null>,
  $props: MediaProviderProps,
) {
  onConnect(() => {
    if ($props.load === 'eager') {
      waitAnimationFrame(startLoadingMedia);
    } else if ($props.load === 'idle') {
      waitIdlePeriod(startLoadingMedia);
    } else if ($props.load === 'visible') {
      root((dispose) => {
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

  function startLoadingMedia() {
    dispatchEvent($target(), 'vds-can-load');
  }

  return { startLoadingMedia };
}
