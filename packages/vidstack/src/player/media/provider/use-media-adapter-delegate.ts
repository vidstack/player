import { effect, ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { RequestQueue } from '../../../foundation/queue/request-queue';
import { clampNumber } from '../../../utils/number';
import type { MediaProviderAdapter, MediaProviderElement, MediaProviderProps } from './types';

/**
 * This hook is responsible for setting provider props on the adapter. All properties are only
 * set when media is ready for playback to avoid errors and to ensure changes are applied.
 */
export function useMediaAdapterDelegate(
  $target: ReadSignal<MediaProviderElement | null>,
  $providerProps: MediaProviderProps,
  adapter: MediaProviderAdapter,
) {
  const logger = __DEV__ ? useLogger($target) : undefined,
    /** Queue ensures adapter is only updated if media is ready for playback. */
    canPlayQueue = new RequestQueue();

  effect(() => {
    const target = $target();
    if (target) {
      listenEvent(target, 'vds-can-play', () => canPlayQueue.start());
      listenEvent(target, 'vds-current-src-change', () => canPlayQueue.stop());
    }
  });

  effect(() => {
    const paused = $providerProps.paused;
    canPlayQueue.queue('paused', () => {
      try {
        if (!paused) {
          adapter.play();
        } else {
          adapter.pause();
        }
      } catch (e) {
        if (__DEV__) {
          logger?.error('paused-change-fail', e);
        }
      }
    });
  });

  effect(() => {
    const volume = clampNumber(0, $providerProps.volume, 1);
    canPlayQueue.queue('volume', () => (adapter.volume = volume));
  });

  effect(() => {
    const muted = $providerProps.muted;
    canPlayQueue.queue('muted', () => (adapter.muted = muted));
  });

  effect(() => {
    const currentTime = $providerProps.currentTime;
    canPlayQueue.queue('currentTime', () => (adapter.currentTime = currentTime));
  });

  effect(() => {
    const playsinline = $providerProps.playsinline;
    canPlayQueue.queue('playsinline', () => (adapter.playsinline = playsinline));
  });
}
