import type { ReadSignal } from 'maverick.js';

import {
  UseFullscreen,
  useFullscreen,
  UseFullscreenProps,
} from '../../../foundation/fullscreen/use-fullscreen';
import { useVideoPresentation } from './presentation/use-video-presentation';
import type { VideoElement } from './types';

/**
 * This hook extends the native fullscreen hook with with additional logic for handling fullscreen
 * on iOS Safari which uses the presentation mode API.
 *
 * @see {@link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode}
 */
export function useVideoFullscreen(
  $target: ReadSignal<VideoElement | null>,
  props: UseFullscreenProps,
): UseVideoFullscreen {
  const fullscreen = useFullscreen($target, props),
    presentation = useVideoPresentation($target, props);
  return {
    get active() {
      return fullscreen.active || presentation.mode === 'fullscreen';
    },
    get supported() {
      return fullscreen.supported || presentation.supported;
    },
    async requestFullscreen() {
      if (fullscreen.supported) return fullscreen.requestFullscreen();
      return presentation.requestFullscreen();
    },
    async exitFullscreen() {
      if (fullscreen.supported) return fullscreen.exitFullscreen();
      return presentation.exitFullscreen();
    },
  };
}

export interface UseVideoFullscreen extends UseFullscreen {}
