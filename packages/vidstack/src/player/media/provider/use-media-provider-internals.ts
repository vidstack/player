import { peek, ReadSignal } from 'maverick.js';
import { dispatchEvent } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import { useMediaState } from '../store';
import type { MediaProviderAdapter, MediaProviderElement } from './types';

export function useMediaProviderInternals(
  $target: ReadSignal<MediaProviderElement | null>,
  adapter: MediaProviderAdapter,
) {
  const $media = useMediaState(),
    logger = __DEV__ ? useLogger($target) : undefined;

  function canAttemptAutoplay() {
    return peek(() => $media.canPlay && $media.autoplay && !$media.started);
  }

  async function attemptAutoplay(): Promise<void> {
    if (!canAttemptAutoplay()) return;

    try {
      await adapter.play();
      dispatchEvent($target(), 'vds-autoplay', {
        detail: { muted: $media.muted },
      });
    } catch (error) {
      dispatchEvent($target(), 'vds-autoplay-fail', {
        detail: {
          muted: $media.muted,
          error: error as Error,
        },
      });
    }
  }

  return {
    canAttemptAutoplay,
    attemptAutoplay,
    throwIfNotReadyForPlayback() {
      if ($media.canPlay) return;
      throw Error(
        __DEV__
          ? `Media is not ready - wait for \`vds-can-play\` event.`
          : '[vidstack] media not ready',
      );
    },
    handleCurrentSrcChange(currentSrc: string, triggerEvent?: Event) {
      if ($media.currentSrc === currentSrc) return;

      if (__DEV__) {
        logger
          ?.infoGroup('📼 Media source change')
          .labelledLog('Src', $media.src)
          .labelledLog('Current Src', currentSrc)
          .dispatch();
      }

      dispatchEvent($target(), 'vds-current-src-change', {
        detail: currentSrc,
        triggerEvent,
      });
    },
    async handleMediaReady(duration: number, triggerEvent?: Event) {
      // Return if it was already fired.
      if ($media.canPlay) return;

      dispatchEvent($target(), 'vds-can-play', {
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

      await attemptAutoplay();
    },
  };
}
