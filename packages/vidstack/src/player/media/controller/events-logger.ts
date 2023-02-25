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
      'media-type-change',
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
      'stream-type-change',
      'replay',
      // 'time-update',
      'view-type-change',
      'volume-change',
      'waiting',
    ]
  : undefined;

export function useMediaEventsLogger({ $player, $store }: MediaContext, logger?: Logger) {
  if (!__DEV__) return;
  effect(() => {
    const player = $player();
    if (player) {
      for (const eventType of mediaEvents!) {
        listenEvent(player, eventType, (event) => {
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
