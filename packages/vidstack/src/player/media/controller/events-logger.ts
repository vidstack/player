import { effect } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import type { Logger } from '../../../foundation/logger/create-logger';
import type { MediaContext } from '../context';
import type { MediaEvents } from '../events';

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

export function useMediaEventsLogger({ $element: $target, $store }: MediaContext, logger?: Logger) {
  if (!__DEV__) return;
  effect(() => {
    const target = $target();
    if (target) {
      for (const eventType of mediaEvents!) {
        listenEvent(target, eventType, (event) => {
          logger
            ?.infoGroup(`📡 dispatching \`${eventType}\``)
            .labelledLog('Media Store', { ...$store })
            .labelledLog('Event', event)
            .dispatch();
        });
      }
    }
  });
}
