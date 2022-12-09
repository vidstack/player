import { dispatchEvent, DOMEvent } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import type { MediaCurrentSrcChangeEvent } from '../events';
import { ATTEMPTING_AUTOPLAY, MediaState } from '../state';
import type { MediaProviderElement } from './types';

export function canAttemptAutoplay($media: MediaState) {
  return $media.canPlay && $media.autoplay && !$media.started;
}

export async function attemptAutoplay(
  provider: MediaProviderElement,
  $media: MediaState,
): Promise<void> {
  if (!canAttemptAutoplay($media)) return;

  $media[ATTEMPTING_AUTOPLAY] = true;

  try {
    await provider.play();
    dispatchEvent(provider, 'vds-autoplay', {
      detail: { muted: $media.muted },
    });
  } catch (error) {
    dispatchEvent(provider, 'vds-autoplay-fail', {
      detail: {
        muted: $media.muted,
        error: error as Error,
      },
    });
  } finally {
    $media[ATTEMPTING_AUTOPLAY] = false;
  }
}

export async function onMediaReady(
  $media: MediaState,
  provider: MediaProviderElement,
  duration: number,
  triggerEvent?: Event,
  logger?: Logger,
) {
  if ($media.canPlay) return;

  dispatchEvent(provider, 'vds-can-play', {
    detail: { duration },
    triggerEvent,
  });

  if (__DEV__) {
    logger
      ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
      .labelledLog('Media', { ...$media })
      .labelledLog('Trigger Event', triggerEvent)
      .dispatch();
  }

  await attemptAutoplay(provider, $media);
}

export function throwIfNotReadyForPlayback($media: MediaState) {
  if ($media.canPlay) return;
  throw Error(
    __DEV__
      ? `Media is not ready - wait for \`vds-can-play\` event.`
      : '[vidstack] media not ready',
  );
}

export function onCurrentSrcChange(
  $media: MediaState,
  provider: MediaProviderElement,
  currentSrc: string,
  logger?: Logger,
): MediaCurrentSrcChangeEvent | undefined {
  if ($media.currentSrc === currentSrc) return;

  if (__DEV__) {
    logger
      ?.infoGroup('📼 Media source change')
      .labelledLog('Src', $media.src)
      .labelledLog('Current Src', currentSrc)
      .dispatch();
  }

  const event = new DOMEvent('vds-current-src-change', {
    detail: currentSrc,
  }) as MediaCurrentSrcChangeEvent;

  provider.dispatchEvent(event);
  return event;
}

export function resetPlaybackIfEnded(provider: MediaProviderElement, $media: MediaState) {
  if (!$media.ended || $media.currentTime === 0) return;
  provider.currentTime = 0;
}
