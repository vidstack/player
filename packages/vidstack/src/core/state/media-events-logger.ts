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
      // 'time-update',
      'view-type-change',
      'volume-change',
      'waiting',
    ]
  : undefined;

export class MediaEventsLogger extends MediaPlayerController {
  constructor(private _media: MediaContext) {
    super();
  }

  protected override onConnect(): void {
    const handler = this._onMediaEvent.bind(this);
    for (const eventType of MEDIA_EVENTS!) this.listen(eventType, handler);
  }

  private _onMediaEvent(event: Event) {
    this._media.logger
      ?.debugGroup(`📡 dispatching \`${event.type}\``)
      .labelledLog('Media Store', { ...this.$state })
      .labelledLog('Event', event)
      .dispatch();
  }
}
