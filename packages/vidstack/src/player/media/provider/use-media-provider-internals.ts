import { peek } from 'maverick.js';
import { dispatchEvent, useHost } from 'maverick.js/std';

import { useHostedLogger } from '../../../foundation/logger/create-logger';
import { useMediaState } from '../store';
import type { MediaProviderAdapter } from './types';

export function useMediaProviderInternals(adapter: MediaProviderAdapter) {
  const host = useHost(),
    $media = useMediaState(),
    logger = __DEV__ ? useHostedLogger() : undefined;

  function canAttemptAutoplay() {
    return peek(() => $media.canPlay && $media.autoplay && !$media.started);
  }

  async function attemptAutoplay(): Promise<void> {
    if (!canAttemptAutoplay()) return;
    try {
      await adapter.play();
      dispatchEvent(host.el, 'vds-autoplay', {
        detail: { muted: $media.muted },
      });
    } catch (error) {
      dispatchEvent(host.el, 'vds-autoplay-fail', {
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
      if (peek(() => $media.canPlay)) return;
      throw Error(
        __DEV__
          ? `Media is not ready - wait for \`vds-can-play\` event.`
          : '[vidstack] media not ready',
      );
    },
    handleCurrentSrcChange(currentSrc: string, triggerEvent?: Event) {
      if (peek(() => $media.currentSrc) === currentSrc) return;

      if (__DEV__) {
        logger
          ?.infoGroup('📼 Media source change')
          .labelledLog(
            'Src',
            peek(() => $media.src),
          )
          .labelledLog('Current Src', currentSrc)
          .dispatch();
      }

      dispatchEvent(host.el, 'vds-current-src-change', {
        detail: currentSrc,
        triggerEvent,
      });
    },
    async handleMediaReady(duration: number, triggerEvent?: Event) {
      // Return if it was already fired.
      if (peek(() => $media.canPlay)) return;

      dispatchEvent(host.el, 'vds-can-play', {
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
