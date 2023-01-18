import { dispatchEvent } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import { ATTEMPTING_AUTOPLAY } from '../state';
import type { MediaStore } from '../store';
import type { MediaSrc } from '../types';
import type { MediaProviderElement } from './types';

export async function onMediaReady(
  $media: MediaStore,
  provider: MediaProviderElement,
  duration: number,
  trigger?: Event,
  logger?: Logger,
) {
  if ($media.canPlay) return;

  dispatchEvent(provider, 'can-play', {
    detail: { duration },
    trigger,
  });

  if (__DEV__) {
    logger
      ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
      .labelledLog('Media', { ...$media })
      .labelledLog('Trigger Event', trigger)
      .dispatch();
  }

  if ($media.canPlay && $media.autoplay && !$media.started) {
    await attemptAutoplay(provider, $media);
  }
}

export function onMediaSrcChange(
  $media: MediaStore,
  provider: MediaProviderElement,
  src: MediaSrc,
  logger?: Logger,
) {
  if ($media.source.src === src.src) return;

  if (__DEV__) {
    logger
      ?.infoGroup('📼 Media source change')
      .labelledLog('Sources', $media.sources)
      .labelledLog('Current Src', src)
      .dispatch();
  }

  dispatchEvent(provider, 'source-change', { detail: src });
}

async function attemptAutoplay(provider: MediaProviderElement, $media: MediaStore): Promise<void> {
  $media[ATTEMPTING_AUTOPLAY] = true;

  try {
    await provider.play();
    dispatchEvent(provider, 'autoplay', {
      detail: { muted: $media.muted },
    });
  } catch (error) {
    dispatchEvent(provider, 'autoplay-fail', {
      detail: {
        muted: $media.muted,
        error: error as Error,
      },
    });
  } finally {
    $media[ATTEMPTING_AUTOPLAY] = false;
  }
}

export function resetPlaybackIfEnded(provider: MediaProviderElement, $media: MediaStore) {
  if (!$media.ended || $media.currentTime === 0) return;
  provider.currentTime = 0;
}

export function throwIfNotReadyForPlayback($media: MediaStore) {
  if ($media.canPlay) return;
  throw Error(
    __DEV__
      ? `[vidstack] media is not ready - wait for \`can-play\` event.`
      : '[vidstack] media not ready',
  );
}
