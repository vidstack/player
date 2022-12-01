import { onConnect } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import { useHostedLogger } from '../../../foundation/logger/create-logger';
import type { MediaEvents } from '../events';
import { useMediaState } from '../store';

const mediaEvents: (keyof MediaEvents)[] | undefined = __DEV__
  ? [
      'vds-abort',
      'vds-can-play',
      'vds-can-play-through',
      'vds-current-src-change',
      'vds-duration-change',
      'vds-emptied',
      'vds-ended',
      'vds-error',
      'vds-fullscreen-change',
      'vds-loaded-data',
      'vds-loaded-metadata',
      'vds-load-start',
      'vds-media-type-change',
      'vds-pause',
      'vds-play',
      'vds-playing',
      'vds-progress',
      'vds-seeked',
      'vds-seeking',
      'vds-stalled',
      'vds-started',
      'vds-suspend',
      'vds-replay',
      // 'vds-time-update',
      'vds-view-type-change',
      'vds-volume-change',
      'vds-waiting',
    ]
  : undefined;

export function useMediaEventsLogger() {
  if (!__DEV__) return;

  const $media = useMediaState(),
    logger = useHostedLogger();

  onConnect((host) => {
    for (const eventType of mediaEvents!) {
      listenEvent(host, eventType as string, (event) => {
        logger
          ?.infoGroup(`📡 dispatching \`${eventType}\``)
          .labelledLog('Media', { ...$media })
          .labelledLog('Event', event)
          .dispatch();
      });
    }
  });
}
