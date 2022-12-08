import { effect, ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { useLogger } from '../../../foundation/logger/use-logger';
import type { MediaEvents } from '../events';
import { useMediaState } from '../store';
import type { MediaProviderElement } from './types';

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

export function useMediaEventsLogger($target: ReadSignal<MediaProviderElement | null>) {
  if (!__DEV__) return;

  const $media = useMediaState(),
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
