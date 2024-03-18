import type { DOMEvent } from 'maverick.js/std';

import type { MediaPlayer } from '../../components/player';

export interface GoogleCastEvents {
  'google-cast-load-start': GoogleCastLoadStartEvent;
  'google-cast-loaded': GoogleCastLoadedEvent;
  'google-cast-prompt-open': GoogleCastPromptEvent;
  'google-cast-prompt-close': GoogleCastPromptEvent;
  'google-cast-prompt-error': GoogleCastPromptErrorEvent;
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

export interface GoogleCastPromptError extends Error {
  code: GoogleCastPromptErrorCode;
}

export type GoogleCastPromptErrorCode =
  | 'CAST_NOT_AVAILABLE'
  | 'CANCEL'
  | 'TIMEOUT'
  | 'API_NOT_INITIALIZED'
  | 'INVALID_PARAMETER'
  | 'EXTENSION_NOT_COMPATIBLE'
  | 'EXTENSION_MISSING'
  | 'RECEIVER_UNAVAILABLE'
  | 'SESSION_ERROR'
  | 'CHANNEL_ERROR'
  | 'NO_DEVICES_AVAILABLE'
  | 'LOAD_MEDIA_FAILED';

/**
 * Fired when requesting Google Cast has failed.
 */
export interface GoogleCastPromptErrorEvent extends GoogleCastEvent<GoogleCastPromptError> {}
