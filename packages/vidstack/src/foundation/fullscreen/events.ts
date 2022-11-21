import type { DOMEvent } from 'maverick.js/std';

declare global {
  interface MaverickOnAttributes extends FullscreenEvents {}
}

export type FullscreenEvents = {
  'vds-fullscreen-change': FullscreenChangeEvent;
  'vds-fullscreen-error': FullscreenErrorEvent;
  'vds-fullscreen-support-change': FullscreenSupportChange;
};

/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @event
 * @bubbles
 * @composed
 */
export type FullscreenChangeEvent = DOMEvent<boolean>;

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @event
 * @bubbles
 * @composed
 */
export type FullscreenErrorEvent = DOMEvent<unknown>;

/**
 * Fired when fullscreen support has changed. To be clear, support does not guarantee the
 * fullscreen request happening, as the browser might still reject the request if it's attempted
 * without user interaction. The event detail is a `boolean` that indicates whether it's
 * supported (`true`), or not (`false`).
 *
 * @event
 */
export type FullscreenSupportChange = DOMEvent<boolean>;
