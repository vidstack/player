import type { DOMEvent } from 'maverick.js/std';

import type { LoggerEvents } from '../../../foundation/logger/events';
import type { ScreenOrientationEvents } from '../../../foundation/orientation/events';
import type { MediaPlayerElement } from '../player';
import type { HLSProviderEvents } from '../providers/hls/events';
import type { VideoPresentationEvents } from '../providers/video/presentation/events';
import type { MediaEvents, UserIdleChangeEvent } from './events';
import type { MediaRequestEvents } from './request-events';

export interface PlayerEvents
  extends MediaEvents,
    MediaRequestEvents,
    MediaUserEvents,
    ScreenOrientationEvents,
    LoggerEvents,
    VideoPresentationEvents,
    HLSProviderEvents {
  'media-player-connect': PlayerConnectEvent;
  /* @internal */
  'find-media-player': FindPlayerEvent;
}

/**
 * Fired when the player element `<media-player>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface PlayerConnectEvent extends DOMEvent<MediaPlayerElement> {}

export interface FindPlayerEventDetail {
  (player: MediaPlayerElement | null): void;
}

/* @internal @bubbles @composed */
export interface FindPlayerEvent extends DOMEvent<FindPlayerEventDetail> {}

export interface MediaUserEvents {
  'user-idle-change': UserIdleChangeEvent;
}
