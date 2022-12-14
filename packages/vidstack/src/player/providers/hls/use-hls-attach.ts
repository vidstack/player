import type * as HLS from 'hls.js';
import { effect, peek, ReadSignal, signal } from 'maverick.js';

import { useLogger } from '../../../foundation/logger/use-logger';
import type { MediaState } from '../../media/state';
import type { HLSConstructor, HLSVideoElement } from './types';

export function useHLSAttach(
  $ctor: ReadSignal<HLSConstructor | null>,
  $target: ReadSignal<HLSVideoElement | null>,
  $engine: ReadSignal<HLS.default | null>,
  $isHLSSource: ReadSignal<boolean>,
  $media: MediaState,
  onLevelLoaded: (eventType: string, data: HLS.LevelLoadedData) => void,
) {
  const $attached = signal(false),
    logger = __DEV__ ? useLogger($target) : undefined;

  // Attach media to `hls.js` engine (if needed) and load source.
  effect(() => {
    const engine = $engine(),
      video = $target()?.mediaElement;

    if (!engine || !video || !$isHLSSource()) {
      if (peek($attached)) {
        engine?.detachMedia();
        $attached.set(false);
      }

      return;
    }

    if (__DEV__) {
      logger
        ?.infoGroup(`📼 Loading Source`)
        .labelledLog('Src', $media.source)
        .labelledLog('Video Element', engine.media)
        .labelledLog('HLS Engine', engine)
        .dispatch();
    }

    if (!peek($attached)) {
      engine.attachMedia(video);

      if (__DEV__) {
        logger
          ?.infoGroup('🏗️ Attached HLS engine')
          .labelledLog('Video Element', video)
          .labelledLog('HLS Engine', engine)
          .dispatch();
      }

      $attached.set(true);
    }

    const levelLoadedEvent = peek($ctor)!.Events.LEVEL_LOADED;
    engine.once(levelLoadedEvent, onLevelLoaded);
    engine.loadSource($media.source.src);
    return () => {
      engine.off(levelLoadedEvent, onLevelLoaded);
    };
  });

  return $attached;
}
