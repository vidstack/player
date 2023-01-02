import { effect, ReadSignal, Signals } from 'maverick.js';
import { dispatchEvent } from 'maverick.js/std';

import { useInternalMediaStore } from '../store';
import type { MediaProviderElement, MediaProviderProps } from './types';

/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the media provider are in response to a media events, these events are
 * the odd ones that are in response to prop changes.
 */
export function useMediaPropChange(
  $target: ReadSignal<MediaProviderElement | null>,
  { $autoplay, $poster, $loop, $controls, $playsinline }: Signals<MediaProviderProps>,
) {
  const $media = useInternalMediaStore()!;

  effect(() => {
    const target = $target();
    if (!target) return;

    effect(() => {
      const autoplay = $autoplay();
      $media.autoplay = autoplay;
      dispatchEvent(target, 'vds-autoplay-change', { detail: autoplay });
    });

    effect(() => {
      const poster = $poster();
      $media.poster = poster;
      dispatchEvent(target, 'vds-poster-change', { detail: poster });
    });

    effect(() => {
      const loop = $loop();
      $media.loop = loop;
      dispatchEvent(target, 'vds-loop-change', { detail: loop });
    });

    effect(() => {
      const controls = $controls();
      $media.controls = controls;
      dispatchEvent(target, 'vds-controls-change', { detail: controls });
    });

    effect(() => {
      const playsinline = $playsinline();
      $media.playsinline = playsinline;
      dispatchEvent(target, 'vds-playsinline-change', { detail: playsinline });
    });
  });
}
