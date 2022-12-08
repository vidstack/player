import {
  createContext,
  effect,
  getScheduler,
  hasProvidedContext,
  provideContext,
  ReadSignal,
  signal,
  useContext,
} from 'maverick.js';
import { onConnect, onDestroy } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

import type { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { useLogPrinter } from '../../../foundation/logger/use-log-printer';
import { useScreenOrientation } from '../../../foundation/orientation/use-screen-orientation';
import { useMediaStateManager } from '../controller/use-media-state-manager';
import { MediaStateContext, useInternalMediaState } from '../store';
import { withMediaFullscreenOptions } from './media-fullscreen';
import type {
  MediaProviderAdapter,
  MediaProviderElement,
  MediaProviderMembers,
  MediaProviderProps,
} from './types';
import { useMediaAdapterDelegate } from './use-media-adapter-delegate';
import { useMediaCanLoad } from './use-media-can-load';
import { useMediaEventsLogger } from './use-media-events-logger';
import { useMediaPropChange } from './use-media-prop-change';

export const MediaProviderContext = createContext(() => signal<MediaProviderElement | null>(null));

/**
 * Contains shared logic between all media providers. This hook is mainly responsible for acting
 * as a middleman between the top-level `<vds-media>` and the underlying media provider element
 * (e.g., `<vds-video>`).
 *
 * This hook's main purpose can be summarized as follows:
 *
 * 1. Dispatch relevant events when the media provider props are changed.
 * 2. Create and return the `MediaProviderMembers` object.
 */
export function useMediaProvider(
  $target: ReadSignal<MediaProviderElement | null>,
  props: UseMediaProviderProps,
): UseMediaProvider {
  if (!hasProvidedContext(MediaProviderContext)) {
    provideContext(MediaStateContext);
    provideContext(MediaProviderContext);
    useMediaStateManager($target);
  }

  const { $provider, adapter, useFullscreen } = props,
    $media = useInternalMediaState()!,
    orientation = useScreenOrientation($target),
    fullscreen = useFullscreen(
      $target,
      withMediaFullscreenOptions({
        get lockType() {
          return $provider.fullscreenOrientation;
        },
        orientation,
      }),
    );

  if (__DEV__) useLogging($target, $provider);
  const { $canLoad, startLoadingMedia } = useMediaCanLoad($target, $provider);
  useMediaPropChange($target, $provider);
  useMediaAdapterDelegate($target, $provider, adapter);

  onConnect(() => {
    const $mediaProvider = useContext(MediaProviderContext);

    $mediaProvider.set($target());
    getScheduler().flushSync();

    const canFullscreen = fullscreen.supported;
    $media.canFullscreen = canFullscreen;
    dispatchEvent($target(), 'vds-fullscreen-support-change', {
      detail: canFullscreen,
    });

    return () => {
      $mediaProvider.set(null);
      getScheduler().flushSync();
    };
  });

  onDestroy(() => dispatchEvent($target(), 'vds-destroy'));

  return {
    orientation,
    fullscreen,
    get paused() {
      return adapter.paused;
    },
    set paused(paused) {
      $provider.paused = paused;
    },
    get currentTime() {
      return adapter.currentTime;
    },
    set currentTime(currentTime) {
      $provider.currentTime = currentTime;
    },
    get volume() {
      return adapter.volume;
    },
    set volume(volume) {
      $provider.volume = volume;
    },
    get muted() {
      return adapter.muted;
    },
    set muted(muted) {
      $provider.muted = muted;
    },
    get playsinline() {
      return adapter.playsinline;
    },
    set playsinline(playsinline) {
      $provider.playsinline = playsinline;
    },
    get canLoad() {
      return $canLoad();
    },
    startLoadingMedia,
    play: adapter.play,
    pause: adapter.pause,
    enterFullscreen: fullscreen.requestFullscreen,
    exitFullscreen: fullscreen.exitFullscreen,
  };
}

export interface UseMediaProviderProps {
  $provider: MediaProviderProps;
  adapter: MediaProviderAdapter;
  useFullscreen: typeof useFullscreen;
}

export interface UseMediaProvider
  extends Omit<MediaProviderMembers, keyof MediaProviderProps>,
    MediaProviderAdapter {}

function useLogging(
  $target: ReadSignal<MediaProviderElement | null>,
  $provider: MediaProviderProps,
) {
  if (!__DEV__) return;

  useMediaEventsLogger($target);

  onConnect(() => {
    const mediaElement = $target()!.closest('vds-media');

    if (!mediaElement) {
      const printer = useLogPrinter($target);
      effect(() => {
        printer.logLevel = $provider.logLevel;
      });
    } else {
      effect(() => {
        mediaElement.logLevel = $provider.logLevel;
      });
    }
  });
}
