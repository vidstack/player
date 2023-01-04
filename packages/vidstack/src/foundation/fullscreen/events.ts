import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

export interface FullscreenEventTarget extends HTMLCustomElement<any, FullscreenEvents> {}

export interface FullscreenEvents {
  'vds-fullscreen-change': FullscreenChangeEvent;
  'vds-fullscreen-error': FullscreenErrorEvent;
  'vds-fullscreen-support-change': FullscreenSupportChange;
}

/**
 * Fired when an element enters/exits fullscreen. The event detail is a `boolean` indicating
 * if fullscreen was entered (`true`) or exited (`false`).
 *
 * @bubbles
 * @composed
 */
export interface FullscreenChangeEvent extends DOMEvent<boolean> {}

/**
 * Fired when an error occurs either entering or exiting fullscreen. This will generally occur
 * if the user has not interacted with the page yet.
 *
 * @bubbles
 * @composed
 */
export interface FullscreenErrorEvent extends DOMEvent<unknown> {}

/**
 * Fired when fullscreen support has changed. To be clear, support does not guarantee the
 * fullscreen request happening, as the browser might still reject the request if it's attempted
 * without user interaction. The event detail is a `boolean` that indicates whether it's
 * supported (`true`), or not (`false`).
 */
export interface FullscreenSupportChange extends DOMEvent<boolean> {}
