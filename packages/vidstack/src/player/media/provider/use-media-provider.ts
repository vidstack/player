import {
  createContext,
  effect,
  hasProvidedContext,
  provideContext,
  ReadSignal,
  signal,
  tick,
  useContext,
} from 'maverick.js';
import { onConnect, onMount } from 'maverick.js/element';
import { dispatchEvent } from 'maverick.js/std';

import type { FullscreenEventTarget } from '../../../foundation/fullscreen/events';
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
export function useMediaProvider<Target extends MediaProviderElement>(
  $target: ReadSignal<Target | null>,
  props: UseMediaProviderProps<Target>,
): UseMediaProvider {
  if (!hasProvidedContext(MediaProviderContext)) {
    provideContext(MediaStateContext);
    provideContext(MediaProviderContext);
    useMediaStateManager($target);
  }

  const { $providerProps, adapter } = props,
    $media = useInternalMediaState()!,
    orientation = useScreenOrientation($target),
    fullscreen = props.fullscreen(
      $target,
      withMediaFullscreenOptions({
        get lockType() {
          return $providerProps.fullscreenOrientation;
        },
        orientation,
      }),
    );

  if (__DEV__) useLogging($target, $providerProps);
  const { startLoadingMedia } = useMediaCanLoad($target, $providerProps);
  useMediaPropChange($target, $providerProps);
  useMediaAdapterDelegate($target, $providerProps, adapter);

  onConnect(() => {
    const $mediaProvider = useContext(MediaProviderContext);

    $mediaProvider.set($target());
    tick();

    const canFullscreen = fullscreen.supported;
    $media.canFullscreen = canFullscreen;
    // TODO: why do we need to type cast this? failing to infer custom element events from generic.
    dispatchEvent($target() as MediaProviderElement, 'vds-fullscreen-support-change', {
      detail: canFullscreen,
    });

    return () => {
      $mediaProvider.set(null);
      tick();
    };
  });

  onMount(() => {
    return () => {
      dispatchEvent($target() as MediaProviderElement, 'vds-destroy');
    };
  });

  return {
    orientation,
    fullscreen,
    get paused() {
      return adapter.paused;
    },
    set paused(paused) {
      $providerProps.paused = paused;
    },
    get currentTime() {
      return adapter.currentTime;
    },
    set currentTime(currentTime) {
      $providerProps.currentTime = currentTime;
    },
    get volume() {
      return adapter.volume;
    },
    set volume(volume) {
      $providerProps.volume = volume;
    },
    get muted() {
      return adapter.muted;
    },
    set muted(muted) {
      $providerProps.muted = muted;
    },
    get playsinline() {
      return adapter.playsinline;
    },
    set playsinline(playsinline) {
      $providerProps.playsinline = playsinline;
    },
    get canLoad() {
      return $media.canLoad;
    },
    startLoadingMedia,
    play: adapter.play,
    pause: adapter.pause,
    enterFullscreen: fullscreen.requestFullscreen,
    exitFullscreen: fullscreen.exitFullscreen,
  };
}

export interface UseMediaProviderProps<Target extends FullscreenEventTarget> {
  $providerProps: MediaProviderProps;
  adapter: MediaProviderAdapter;
  fullscreen: typeof useFullscreen<Target>;
}

export interface UseMediaProvider
  extends Omit<MediaProviderMembers, keyof MediaProviderProps>,
    MediaProviderAdapter {}

function useLogging(
  $target: ReadSignal<MediaProviderElement | null>,
  $providerProps: MediaProviderProps,
) {
  if (!__DEV__) return;

  useMediaEventsLogger($target);

  onConnect(() => {
    const mediaElement = $target()!.closest('vds-media');

    if (!mediaElement) {
      const printer = useLogPrinter($target);
      effect(() => {
        printer.logLevel = $providerProps.logLevel;
      });
    } else {
      effect(() => {
        mediaElement.logLevel = $providerProps.logLevel;
      });
    }
  });
}
