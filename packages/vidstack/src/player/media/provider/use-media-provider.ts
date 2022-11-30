import {
  createContext,
  effect,
  getScheduler,
  hasProvidedContext,
  observable,
  provideContext,
  useContext,
} from 'maverick.js';
import { onConnect, onDestroy } from 'maverick.js/element';
import { dispatchEvent, useHost } from 'maverick.js/std';
import type { Simplify } from 'type-fest';

import type { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import { useLogPrinter } from '../../../foundation/logger/use-log-printer';
import { useHostedScreenOrientation } from '../../../foundation/orientation/use-screen-orientation';
import { useMediaStateManager } from '../controller/use-media-state-manager';
import { MediaStateContext, useInternalMediaState } from '../store';
import { withMediaFullscreenOptions } from './media-fullscreen';
import {
  type MediaProvider,
  type MediaProviderAdapter,
  type MediaProviderMembers,
  type MediaProviderProps,
  SET_CAN_LOAD_POSTER,
} from './types';
import { useMediaAdapterDelegate } from './use-media-adapter-delegate';
import { useMediaCanLoad } from './use-media-can-load';
import { useMediaEventsLogger } from './use-media-events-logger';
import { useMediaPropChange } from './use-media-prop-change';

export const MediaProviderContext = createContext(() => observable<MediaProvider | null>(null));

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
export function useMediaProvider(props: UseMediaProviderProps): UseMediaProvider {
  if (!hasProvidedContext(MediaProviderContext)) {
    provideContext(MediaStateContext);
    provideContext(MediaProviderContext);
    useMediaStateManager();
  }

  const host = useHost(),
    { $provider, adapter, useFullscreen } = props,
    $media = useInternalMediaState()!,
    $canLoadPoster = observable(false),
    orientation = useHostedScreenOrientation(),
    fullscreen = useFullscreen(
      withMediaFullscreenOptions({
        get lockType() {
          return $provider.fullscreenOrientation;
        },
        orientation,
      }),
    );

  if (__DEV__) useLogging($provider);
  const { $canLoad, startLoadingMedia } = useMediaCanLoad(host, $provider);
  useMediaPropChange($provider);
  useMediaAdapterDelegate($provider, adapter);

  onConnect((host) => {
    const $mediaProvider = useContext(MediaProviderContext);

    $mediaProvider.set(host as unknown as MediaProvider);
    getScheduler().flushSync();

    const canFullscreen = fullscreen.supported;
    $media.canFullscreen = canFullscreen;
    dispatchEvent(host, 'vds-fullscreen-support-change', {
      detail: canFullscreen,
    });

    return () => {
      $mediaProvider.set(null);
      getScheduler().flushSync();
    };
  });

  onDestroy((host) => dispatchEvent(host, 'vds-destroy'));

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
    get canLoadPoster() {
      return $canLoadPoster();
    },
    [SET_CAN_LOAD_POSTER]: $canLoadPoster.set,
    startLoadingMedia,
    play: adapter.play,
    pause: adapter.pause,
    enterFullscreen: fullscreen.requestFullscreen,
    exitFullscreen: fullscreen.exitFullscreen,
  };
}

export type UseMediaProviderProps = {
  $provider: MediaProviderProps;
  adapter: MediaProviderAdapter;
  useFullscreen: typeof useFullscreen;
  onDefaultSlotChange: (element: HTMLElement) => void;
};

export type UseMediaProvider = Simplify<
  Omit<MediaProviderMembers, keyof MediaProviderProps> & MediaProviderAdapter
>;

function useLogging($provider: MediaProviderProps) {
  if (!__DEV__) return;

  useMediaEventsLogger();

  onConnect((host) => {
    const mediaElement = host.closest('vds-media');

    if (!mediaElement) {
      const printer = useLogPrinter({
        $target: () => host,
      });

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
