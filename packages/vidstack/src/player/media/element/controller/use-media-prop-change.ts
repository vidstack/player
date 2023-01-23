import { effect, ReadSignal, Signals } from 'maverick.js';
import { dispatchEvent } from 'maverick.js/std';

import type { MediaElement } from '../../element/types';
import type { MediaStore } from '../../store';
import type { MediaControllerProps } from './types';

/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the media controller are in response to a media events, these events are
 * the odd ones that are in response to prop changes.
 */
export function useMediaPropChange(
  $target: ReadSignal<MediaElement | null>,
  $media: MediaStore,
  {
    $autoplay,
    $poster,
    $loop,
    $controls,
    $playsinline,
    $view,
    $logLevel,
  }: Signals<MediaControllerProps>,
) {
  if (__SERVER__) return;

  effect(() => {
    const target = $target();
    if (!target) return;

    if (__DEV__) {
      effect(() => {
        $media.logLevel = $logLevel();
      });
    }

    effect(() => {
      const autoplay = $autoplay();
      $media.autoplay = autoplay;
      dispatchEvent(target, 'autoplay-change', { detail: autoplay });
    });

    effect(() => {
      const poster = $poster();
      $media.poster = poster;
      dispatchEvent(target, 'poster-change', { detail: poster });
    });

    effect(() => {
      const loop = $loop();
      $media.loop = loop;
      dispatchEvent(target, 'loop-change', { detail: loop });
    });

    effect(() => {
      const controls = $controls();
      $media.controls = controls;
      dispatchEvent(target, 'controls-change', { detail: controls });
    });

    effect(() => {
      const playsinline = $playsinline();
      $media.playsinline = playsinline;
      dispatchEvent(target, 'playsinline-change', { detail: playsinline });
    });

    effect(() => {
      const view = $view();
      $media.view = view;
      dispatchEvent(target, 'view-change', { detail: view });
    });
  });
}
