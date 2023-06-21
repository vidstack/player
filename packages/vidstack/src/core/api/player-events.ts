import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components';
import type { LoggerEvents } from '../../foundation/logger/events';
import type { ScreenOrientationEvents } from '../../foundation/orientation/events';
import type { HLSProviderEvents } from '../../providers/hls/events';
import type { VideoPresentationEvents } from '../../providers/video/presentation/events';
import type { MediaEvents } from './media-events';
import type { MediaRequestEvents } from './media-request-events';

export interface MediaPlayerEvents
  extends MediaEvents,
    MediaRequestEvents,
    MediaUserEvents,
    ScreenOrientationEvents,
    LoggerEvents,
    VideoPresentationEvents,
    HLSProviderEvents {
  'media-player-connect': MediaPlayerConnectEvent;
  /* @internal */
  'find-media-player': FindMediaPlayerEvent;
}

/**
 * Fired when the player element `<media-player>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaPlayerConnectEvent extends DOMEvent<MediaPlayer> {}

export interface FindMediaPlayerEventDetail {
  (player: MediaPlayer | null): void;
}

/* @internal @bubbles @composed */
export interface FindMediaPlayerEvent extends DOMEvent<FindMediaPlayerEventDetail> {}

export interface MediaUserEvents {}
