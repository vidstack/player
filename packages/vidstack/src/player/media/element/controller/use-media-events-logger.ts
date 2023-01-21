import { effect, ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { useLogger } from '../../../../foundation/logger/use-logger';
import type { MediaElement } from '../../element/types';
import type { MediaEvents } from '../../events';
import { useMediaStore } from '../../store';

const mediaEvents: (keyof MediaEvents)[] | undefined = __DEV__
  ? [
      'abort',
      'can-play',
      'can-play-through',
      'duration-change',
      'emptied',
      'ended',
      'error',
      'fullscreen-change',
      'loaded-data',
      'loaded-metadata',
      'load-start',
      'media-change',
      'pause',
      'play',
      'playing',
      'progress',
      'seeked',
      'seeking',
      'source-change',
      'sources-change',
      'stalled',
      'started',
      'suspend',
      'replay',
      // 'time-update',
      'view-change',
      'volume-change',
      'waiting',
    ]
  : undefined;

export function useMediaEventsLogger($target: ReadSignal<MediaElement | null>) {
  if (!__DEV__) return;

  const $media = useMediaStore(),
    logger = useLogger($target);

  effect(() => {
    const target = $target();
    if (target) {
      for (const eventType of mediaEvents!) {
        listenEvent(target, eventType, (event) => {
          logger
            ?.infoGroup(`📡 dispatching \`${eventType}\``)
            .labelledLog('Media', { ...$media })
            .labelledLog('Event', event)
            .dispatch();
        });
      }
    }
  });
}
