import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components';
import type { LoggerEvents } from '../../foundation/logger/events';
import type { GoogleCastEvents } from '../../providers/google-cast/events';
import type { HLSProviderEvents } from '../../providers/hls/events';
import type { VideoPresentationEvents } from '../../providers/video/presentation/events';
import type { MediaEvents } from './media-events';
import type { MediaRequestEvents } from './media-request-events';

export interface MediaPlayerEvents
  extends MediaEvents,
    MediaRequestEvents,
    MediaUserEvents,
    LoggerEvents,
    VideoPresentationEvents,
    HLSProviderEvents,
    GoogleCastEvents {
  'media-player-connect': MediaPlayerConnectEvent;
  /* @internal */
  'find-media-player': FindMediaPlayerEvent;
  /* @internal */
  'vds-font-change': Event;
}

/**
 * Fired when the player element `<media-player>` connects to the DOM.
 *
 * @bubbles
 * @composed
 * @detail player
 */
export interface MediaPlayerConnectEvent extends DOMEvent<MediaPlayer> {}

export interface FindMediaPlayerEventDetail {
  (player: MediaPlayer | null): void;
}

/**
 * @internal
 * @bubbles
 * @composed
 * @detail callback
 */
export interface FindMediaPlayerEvent extends DOMEvent<FindMediaPlayerEventDetail> {}

export interface MediaUserEvents {}
