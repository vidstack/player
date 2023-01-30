import { effect, Signals } from 'maverick.js';
import { dispatchEvent } from 'maverick.js/std';

import type { MediaContext } from '../context';
import type { MediaControllerProps } from './types';

/**
 * This hook is responsible for dispatching media events that are in response to prop changes. Other
 * events dispatched by the media controller are in response to a media events, these events are
 * the odd ones that are in response to prop changes.
 */
export function useMediaPropChange(
  { $element: $controller, $store }: MediaContext,
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
    const controller = $controller();
    if (!controller) return;

    if (__DEV__) {
      effect(() => {
        $store.logLevel = $logLevel();
      });
    }

    effect(() => {
      const autoplay = $autoplay();
      $store.autoplay = autoplay;
      dispatchEvent(controller, 'autoplay-change', { detail: autoplay });
    });

    effect(() => {
      const poster = $poster();
      $store.poster = poster;
      dispatchEvent(controller, 'poster-change', { detail: poster });
    });

    effect(() => {
      const loop = $loop();
      $store.loop = loop;
      dispatchEvent(controller, 'loop-change', { detail: loop });
    });

    effect(() => {
      const controls = $controls();
      $store.controls = controls;
      dispatchEvent(controller, 'controls-change', { detail: controls });
    });

    effect(() => {
      const playsinline = $playsinline();
      $store.playsinline = playsinline;
      dispatchEvent(controller, 'playsinline-change', { detail: playsinline });
    });

    effect(() => {
      const view = $view();
      $store.view = view;
      dispatchEvent(controller, 'view-change', { detail: view });
    });
  });
}
