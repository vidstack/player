import { effect } from 'maverick.js';
import { onConnect } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import { useHostedLogger } from '../../../foundation/logger/create-logger';
import { RequestQueue } from '../../../foundation/queue/request-queue';
import { clampNumber } from '../../../utils/number';
import type { MediaProviderAdapter, MediaProviderProps } from './types';

/**
 * This hook is responsible for setting provider props on the adapter. All properties are only
 * set when media is ready for playback to avoid errors and to ensure changes are applied.
 */
export function useMediaAdapterDelegate(
  $provider: MediaProviderProps,
  adapter: MediaProviderAdapter,
) {
  const logger = __DEV__ ? useHostedLogger() : undefined,
    /** Queue ensures adapter is only updated if media is ready for playback. */
    canPlayQueue = new RequestQueue();

  onConnect((host) => {
    listenEvent(host, 'vds-can-play', () => canPlayQueue.start());
    listenEvent(host, 'vds-current-src-change', () => canPlayQueue.stop());
  });

  effect(() => {
    const paused = $provider.paused;
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
    const volume = clampNumber(0, $provider.volume, 1);
    canPlayQueue.queue('volume', () => (adapter.volume = volume));
  });

  effect(() => {
    const muted = $provider.muted;
    canPlayQueue.queue('muted', () => (adapter.muted = muted));
  });

  effect(() => {
    const currentTime = $provider.currentTime;
    canPlayQueue.queue('currentTime', () => (adapter.currentTime = currentTime));
  });

  effect(() => {
    const playsinline = $provider.playsinline;
    canPlayQueue.queue('playsinline', () => (adapter.playsinline = playsinline));
  });
}
