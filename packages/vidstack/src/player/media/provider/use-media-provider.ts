import {
  createContext,
  effect,
  hasProvidedContext,
  provideContext,
  ReadSignal,
  signal,
  Signals,
  tick,
  useContext,
} from 'maverick.js';
import { onConnect, onMount } from 'maverick.js/element';
import { dispatchEvent, mergeProperties } from 'maverick.js/std';

import type { FullscreenEventTarget } from '../../../foundation/fullscreen/events';
import type { useFullscreen } from '../../../foundation/fullscreen/use-fullscreen';
import type { LogLevel } from '../../../foundation/logger/log-level';
import { useLogPrinter } from '../../../foundation/logger/use-log-printer';
import { useScreenOrientation } from '../../../foundation/orientation/use-screen-orientation';
import { useMediaStateManager } from '../controller/use-media-state-manager';
import { MediaStoreContext, useInternalMediaStore } from '../store';
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
  { $props, adapter, ...props }: UseMediaProviderProps<Target>,
): UseMediaProvider {
  if (!hasProvidedContext(MediaProviderContext)) {
    provideContext(MediaStoreContext);
    provideContext(MediaProviderContext);
    useMediaStateManager($target);
  }

  const $media = useInternalMediaStore()!,
    orientation = useScreenOrientation($target),
    fullscreen = props.fullscreen(
      $target,
      withMediaFullscreenOptions({
        $lockType: $props.$fullscreenOrientation,
        orientation,
      }),
    );

  if (__DEV__) useLogging($target, $props.$logLevel);
  const { startLoadingMedia } = useMediaCanLoad($target, $props.$load);
  useMediaPropChange($target, $props);
  useMediaAdapterDelegate($target, $props, adapter);

  onConnect(() => {
    const $mediaProvider = useContext(MediaProviderContext);

    $mediaProvider.set($target());
    tick();

    const canFullscreen = fullscreen.supported;
    $media.canFullscreen = canFullscreen;

    // TODO: why do we need to type cast this? failing to infer custom element events from generic.
    dispatchEvent($target() as MediaProviderElement, 'fullscreen-support-change', {
      detail: canFullscreen,
    });

    return () => {
      $mediaProvider.set(null);
      tick();
    };
  });

  onMount(() => {
    return () => {
      dispatchEvent($target() as MediaProviderElement, 'destroy');
    };
  });

  return mergeProperties(adapter, {
    orientation,
    fullscreen,
    get canLoad() {
      return $media.canLoad;
    },
    startLoadingMedia,
    enterFullscreen: fullscreen.requestFullscreen,
    exitFullscreen: fullscreen.exitFullscreen,
  });
}

export interface UseMediaProviderProps<Target extends FullscreenEventTarget> {
  $props: Signals<MediaProviderProps>;
  adapter: MediaProviderAdapter;
  fullscreen: typeof useFullscreen<Target>;
}

export interface UseMediaProvider
  extends Omit<MediaProviderMembers, keyof MediaProviderProps>,
    MediaProviderAdapter {}

function useLogging(
  $target: ReadSignal<MediaProviderElement | null>,
  $logLevel: ReadSignal<LogLevel>,
) {
  if (!__DEV__) return;

  useMediaEventsLogger($target);

  onConnect(() => {
    const mediaElement = $target()!.closest('vds-media');
    if (!mediaElement) {
      const printer = useLogPrinter($target);
      effect(() => {
        printer.logLevel = $logLevel();
      });
    }
  });
}
