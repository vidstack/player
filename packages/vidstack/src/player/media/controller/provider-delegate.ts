import { effect, peek, Signals } from 'maverick.js';

import { RequestQueue } from '../../../foundation/queue/request-queue';
import { clampNumber } from '../../../utils/number';
import type { MediaContext } from '../context';
import type { MediaState } from '../state';
import type { MediaRequestManager } from './request-manager';
import type { MediaControllerProps } from './types';

/**
 * This hook is responsible for setting provider props on the current provider. All properties are
 * only set when media is ready for playback to avoid errors and to ensure changes are applied.
 */
export function useMediaProviderDelegate(
  { $provider, $store: $media }: MediaContext,
  requestManager: MediaRequestManager,
  {
    $paused,
    $volume,
    $muted,
    $currentTime,
    $playsinline,
    $playbackRate,
  }: Signals<MediaControllerProps>,
) {
  /** Queue ensures adapter is only updated if media is ready for playback. */
  const canPlayQueue = new RequestQueue();

  effect(() => {
    if ($media.canPlay && $provider()) canPlayQueue._start();
    else canPlayQueue._stop();
  });

  effect(() => setMuted($muted()));
  effect(() => setPaused($paused()));
  effect(() => setVolume($volume()));
  effect(() => setCurrentTime($currentTime()));
  effect(() => setPlaysinline($playsinline()));
  effect(() => setPlaybackRate($playbackRate()));

  function setPaused(paused: boolean) {
    if (paused) canPlayQueue._enqueue('paused', requestManager._pause);
    else canPlayQueue._enqueue('paused', requestManager._play);
  }

  function setVolume(volume: number) {
    const newVolume = clampNumber(0, volume, 1);
    canPlayQueue._enqueue('volume', () => ($provider()!.volume = newVolume));
  }

  function setMuted(muted: boolean) {
    canPlayQueue._enqueue('muted', () => ($provider()!.muted = muted));
  }

  function setCurrentTime(currentTime: number) {
    canPlayQueue._enqueue('currentTime', () => {
      const adapter = $provider();
      if (currentTime !== adapter!.currentTime) {
        peek(() => {
          const boundTime = Math.min(
            Math.max($media.seekableStart + 0.1, currentTime),
            $media.seekableEnd - 0.1,
          );

          if (Number.isFinite(boundTime)) adapter!.currentTime = boundTime;
        });
      }
    });
  }

  function setPlaysinline(playsinline: boolean) {
    canPlayQueue._enqueue('playsinline', () => ($provider()!.playsinline = playsinline));
  }

  function setPlaybackRate(rate: number) {
    canPlayQueue._enqueue('rate', () => ($provider()!.playbackRate = rate));
  }

  const delegate = {} as Pick<
    MediaState,
    'paused' | 'muted' | 'volume' | 'currentTime' | 'playsinline' | 'playbackRate'
  >;

  const setters: Record<keyof typeof delegate, (value: any) => void> = {
    paused: setPaused,
    muted: setMuted,
    volume: setVolume,
    currentTime: setCurrentTime,
    playsinline: setPlaysinline,
    playbackRate: setPlaybackRate,
  };

  for (const prop of Object.keys(setters)) {
    Object.defineProperty(delegate, prop, {
      get: () => $media[prop],
      set: setters[prop],
    });
  }

  return delegate;
}
