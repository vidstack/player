import { createContext, ReadSignal, useContext } from 'maverick.js';
import { DOMEvent, InferEventDetail, InferEventInit } from 'maverick.js/std';

import { useLogger } from '../../../../foundation/logger/use-logger';
import type { MediaEvents } from '../../events';
import { ATTEMPTING_AUTOPLAY } from '../../state';
import type { MediaStore } from '../../store';
import type { MediaSrc } from '../../types';
import type { MediaControllerElement } from './types';

export const MediaControllerDelegateContext = createContext<MediaControllerDelegate>();

export interface MediaControllerDelegate {
  attemptAutoplay(): Promise<void>;
  mediaReady(duration: number, trigger?: Event): Promise<void>;
  srcChange(src: MediaSrc): void;
  dispatch<Type extends keyof MediaEvents>(
    type: Type,
    ...init: InferEventDetail<MediaEvents[Type]> extends void | undefined | never
      ? [init?: Partial<InferEventInit<MediaEvents[Type]>>]
      : [init: InferEventInit<MediaEvents[Type]>]
  ): void;
}

export function useMediaControllerDelegate(): MediaControllerDelegate {
  return useContext(MediaControllerDelegateContext);
}

export function createMediaControllerDelegate(
  $target: ReadSignal<MediaControllerElement | null>,
  $media: MediaStore,
  handleMediaEvent: (event: Event) => void,
): MediaControllerDelegate {
  const logger = __DEV__ ? useLogger($target) : undefined;

  const dispatch: MediaControllerDelegate['dispatch'] = (type, ...init) => {
    handleMediaEvent(new DOMEvent<any>(type, init?.[0]));
  };

  async function mediaReady(duration, trigger) {
    if ($media.canPlay) return;

    dispatch('can-play', { detail: { duration }, trigger });

    if (__DEV__) {
      logger
        ?.infoGroup('-~-~-~-~-~-~-~-~- ✅ MEDIA READY -~-~-~-~-~-~-~-~-')
        .labelledLog('Media', { ...$media })
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if ($media.canPlay && $media.autoplay && !$media.started) {
      await attemptAutoplay();
    }
  }

  async function attemptAutoplay() {
    $media[ATTEMPTING_AUTOPLAY] = true;
    try {
      await $target()!.play();
      dispatch('autoplay', { detail: { muted: $media.muted } });
    } catch (error) {
      dispatch('autoplay-fail', {
        detail: {
          muted: $media.muted,
          error: error as Error,
        },
      });
    } finally {
      $media[ATTEMPTING_AUTOPLAY] = false;
    }
  }

  return {
    dispatch,
    mediaReady,
    attemptAutoplay,
    srcChange(src) {
      if ($media.source.src === src.src) return;

      if (__DEV__) {
        logger
          ?.infoGroup('📼 Media source change')
          .labelledLog('Sources', $media.sources)
          .labelledLog('Current Src', src)
          .dispatch();
      }

      dispatch('source-change', { detail: src });
    },
  };
}
