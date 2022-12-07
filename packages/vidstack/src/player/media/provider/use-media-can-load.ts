import { effect, ReadSignal, root, signal } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { dispatchEvent, waitAnimationFrame, waitIdlePeriod } from 'maverick.js/std';

import { useIntersectionObserver } from '../../../foundation/observers/use-intersection-observer';
import type { MediaProviderElement, MediaProviderProps } from './types';

/**
 * This hook is responsible for initializing and updating the media `canPlay` state.
 */
export function useMediaCanLoad(
  $target: ReadSignal<MediaProviderElement | null>,
  $provider: MediaProviderProps,
) {
  const $canLoad = signal(false);

  onConnect(() => {
    if ($provider.load === 'eager') {
      waitAnimationFrame(startLoadingMedia);
    } else if ($provider.load === 'idle') {
      waitIdlePeriod(startLoadingMedia);
    } else if ($provider.load === 'visible') {
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
    $canLoad.set(true);
    dispatchEvent($target(), 'vds-can-load');
  }

  return { $canLoad, startLoadingMedia };
}
