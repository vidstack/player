import { EventsController } from 'maverick.js/std';

import { type MediaContext } from '../api/media-context';
import type { MediaEvents } from '../api/media-events';
import { MediaPlayerController } from '../api/player-controller';

const MEDIA_EVENTS: (keyof MediaEvents)[] | undefined = __DEV__
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
      // time-change,
      // 'time-update',
      'view-type-change',
      'volume-change',
      'waiting',
    ]
  : undefined;

export class MediaEventsLogger extends MediaPlayerController {
  #media: MediaContext;

  constructor(media: MediaContext) {
    super();
    this.#media = media;
  }

  protected override onConnect(el: HTMLElement): void {
    const events = new EventsController(el),
      handler = this.#onMediaEvent.bind(this);

    for (const eventType of MEDIA_EVENTS!) {
      // @ts-expect-error - player events on html element
      events.add(eventType, handler);
    }
  }

  #onMediaEvent(event: Event) {
    this.#media.logger
      ?.debugGroup(`📡 dispatching \`${event.type}\``)
      .labelledLog('Media Store', { ...this.$state })
      .labelledLog('Event', event)
      .dispatch();
  }
}
