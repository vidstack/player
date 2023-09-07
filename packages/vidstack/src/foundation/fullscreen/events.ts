import type { DOMEvent } from 'maverick.js/std';

export interface FullscreenEvents {
  'fullscreen-change': FullscreenChangeEvent;
  'fullscreen-error': FullscreenErrorEvent;
}

/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @bubbles
 * @composed
 * @detail isFullscreen
 */
export interface FullscreenChangeEvent extends DOMEvent<boolean> {}

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 * @detail error
 */
export interface FullscreenErrorEvent extends DOMEvent<unknown> {}
