import { createContext, effect, ReadSignal, signal, Signals } from 'maverick.js';

import { RequestQueue } from '../../../../foundation/queue/request-queue';
import { clampNumber } from '../../../../utils/number';
import type { MediaStore } from '../../store';
import type { MediaElementProps } from '../types';
import type { MediaAdapter } from './types';
import type { MediaRequestManager } from './use-media-request-manager';

export const mediaAdapterContext = createContext(() => signal<MediaAdapter | null>(null));

/**
 * This hook is responsible for setting provider props on the adapter. All properties are only
 * set when media is ready for playback to avoid errors and to ensure changes are applied.
 */
export function useMediaAdapterDelegate(
  $adapter: ReadSignal<MediaAdapter | undefined>,
  $media: MediaStore,
  requestManager: MediaRequestManager,
  { $paused, $volume, $muted, $currentTime, $playsinline }: Signals<MediaElementProps>,
) {
  if (__SERVER__) return;

  /** Queue ensures adapter is only updated if media is ready for playback. */
  const canPlayQueue = new RequestQueue();

  effect(() => {
    if ($media.canPlay) canPlayQueue.start();
    else canPlayQueue.stop();
  });

  effect(() => {
    const paused = $paused();
    if (paused) canPlayQueue.queue('paused', requestManager.pause);
    else canPlayQueue.queue('paused', requestManager.play);
  });

  effect(() => {
    const volume = clampNumber(0, $volume(), 1);
    canPlayQueue.queue('volume', () => ($adapter()!.volume = volume));
  });

  effect(() => {
    const muted = $muted();
    canPlayQueue.queue('muted', () => ($adapter()!.muted = muted));
  });

  effect(() => {
    const currentTime = $currentTime();
    canPlayQueue.queue('currentTime', () => {
      const adapter = $adapter();
      if (currentTime !== adapter!.currentTime) adapter!.currentTime = currentTime;
    });
  });

  effect(() => {
    const playsinline = $playsinline();
    canPlayQueue.queue('playsinline', () => ($adapter()!.playsinline = playsinline));
  });
}
