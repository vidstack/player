import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';

export interface GoogleCastEvents {
  'google-cast-load-start': GoogleCastLoadStartEvent;
  'google-cast-loaded': GoogleCastLoadedEvent;
  'google-cast-prompt-open': GoogleCastPromptEvent;
  'google-cast-prompt-close': GoogleCastPromptEvent;
}

export interface GoogleCastEvent<DetailType = unknown> extends DOMEvent<DetailType> {
  target: MediaPlayer;
}

/**
 * Fired when the Google Cast framework starts loading.
 */
export interface GoogleCastLoadStartEvent extends GoogleCastEvent<void> {}

/**
 * Fired when the Google Cast framework has loaded.
 */
export interface GoogleCastLoadedEvent extends GoogleCastEvent<void> {}

/**
 * Fired when the Google Cast prompt is opened/closed.
 */
export interface GoogleCastPromptEvent extends GoogleCastEvent<void> {}
