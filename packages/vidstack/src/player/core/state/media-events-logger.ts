import { ComponentController, ComponentInstance } from 'maverick.js/element';

import { type MediaContext } from '../api/context';
import type { MediaEvents } from '../api/events';
import type { PlayerAPI } from '../player';

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
      // 'time-update',
      'view-type-change',
      'volume-change',
      'waiting',
    ]
  : undefined;

export class MediaEventsLogger extends ComponentController<PlayerAPI> {
  constructor(instance: ComponentInstance<PlayerAPI>, private _media: MediaContext) {
    super(instance);
  }

  protected override onConnect(): void {
    const handler = this._onMediaEvent.bind(this);
    for (const eventType of MEDIA_EVENTS!) this.listen(eventType, handler);
  }

  private _onMediaEvent(event: Event) {
    this._media.logger
      ?.infoGroup(`📡 dispatching \`${event.type}\``)
      .labelledLog('Media Store', { ...this.$store })
      .labelledLog('Event', event)
      .dispatch();
  }
}
