import { effect, ReadSignal } from 'maverick.js';
import { dispatchEvent } from 'maverick.js/std';

import { useInternalMediaState } from '../store';
import type { MediaProviderElement, MediaProviderProps } from './types';

/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the media provider are in response to a media events, these events are
 * the odd ones that are in response to prop changes.
 */
export function useMediaPropChange(
  $target: ReadSignal<MediaProviderElement | null>,
  $provider: MediaProviderProps,
) {
  const $media = useInternalMediaState()!;

  effect(() => {
    const target = $target();
    if (!target) return;

    effect(() => {
      const autoplay = $provider.autoplay;
      $media.autoplay = autoplay;
      dispatchEvent(target, 'vds-autoplay-change', { detail: autoplay });
    });

    effect(() => {
      const poster = $provider.poster;
      $media.poster = poster;
      dispatchEvent(target, 'vds-poster-change', { detail: poster });
    });

    effect(() => {
      const loop = $provider.loop;
      $media.loop = loop;
      dispatchEvent(target, 'vds-loop-change', { detail: loop });
    });

    effect(() => {
      const controls = $provider.controls;
      $media.controls = controls;
      dispatchEvent(target, 'vds-controls-change', { detail: controls });
    });

    effect(() => {
      const playsinline = $provider.playsinline;
      $media.playsinline = playsinline;
      dispatchEvent(target, 'vds-playsinline-change', { detail: playsinline });
    });
  });
}
