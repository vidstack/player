import { effect } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

import { useInternalMediaState } from '../store';
import type { MediaProviderProps } from './types';

/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the media provider are in response to a media events, these events are
 * the odd ones that are in response to prop changes.
 */
export function useMediaPropChange($provider: MediaProviderProps) {
  const $media = useInternalMediaState()!;

  onConnect((host) => {
    effect(() => {
      const autoplay = $provider.autoplay;
      $media.autoplay = autoplay;
      dispatchEvent(host, 'vds-autoplay-change', { detail: autoplay });
    });

    effect(() => {
      const poster = $provider.poster;
      $media.poster = poster;
      dispatchEvent(host, 'vds-poster-change', { detail: poster });
    });

    effect(() => {
      const loop = $provider.loop;
      $media.loop = loop;
      dispatchEvent(host, 'vds-loop-change', { detail: loop });
    });

    effect(() => {
      const controls = $provider.controls;
      $media.controls = controls;
      dispatchEvent(host, 'vds-controls-change', { detail: controls });
    });

    effect(() => {
      const playsinline = $provider.playsinline;
      $media.playsinline = playsinline;
      dispatchEvent(host, 'vds-playsinline-change', { detail: playsinline });
    });
  });
}
