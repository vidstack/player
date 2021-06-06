import { VdsElement } from '../elements';
import { VdsCustomEvent } from '../events';

export interface FullscreenHost extends VdsElement {
	/**
	 * Requests to enter fullscreen mode, returning a `Promise` that will resolve if the request is
	 * made, or reject with a reason for failure.
	 *
	 * Do not rely on a resolved promise to determine if the element is in fullscreen or not. The only
	 * way to be certain is by listening to the `vds-fullscreen-change` event, or by adding an
	 * event listener to the fullscreen controller.
	 *
	 * Some common reasons for failure are:
	 *
	 * - The fullscreen API is not available.
	 * - The user has not interacted with the page yet.
	 *
	 * @param options - When supplied, options's navigationUI member indicates whether showing
	 * navigation UI while in fullscreen is preferred or not. If set to "show", navigation simplicity
	 * is preferred over screen space, and if set to "hide", more screen space is preferred. User
	 * agents are always free to honor user preference over the application's. The default value
	 * "auto" indicates no application preference.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
	 * @spec https://fullscreen.spec.whatwg.org
	 */
	requestFullscreen(): Promise<void>;

	/**
	 * Requests to exit fullscreen mode, returning a `Promise` that will resolve if the request
	 * is successful, or reject with a reason for failure. Refer to `requestFullscreen()` for more
	 * information.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
	 * @spec https://fullscreen.spec.whatwg.org
	 */
	exitFullscreen(): Promise<void>;
}

export interface FullscreenEvents {
	'fullscreen-change': VdsCustomEvent<boolean>;
	error: VdsCustomEvent<void>;
}
