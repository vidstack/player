import fscreen from 'fscreen';

import { isUndefined, noop } from '../../utils/unit.js';
import { DisposalBin, EventDispatcher, listen } from '../events/index.js';
import {
	ScreenOrientationController,
	ScreenOrientationLock
} from '../screen-orientation/index.js';

/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 *
 * @extends EventDispatcher<import('./types').FullscreenEvents>
 *
 * @example
 * ```js
 * import { VdsElement, FullscreenController, ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends VdsElement {
 *   fullscreenController = new FullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *   );
 *
 *   requestFullscreen() {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   exitFullscreen() {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class FullscreenController extends EventDispatcher {
	/** @protected @readonly */
	disposal = new DisposalBin();

	/**
	 * Used to avoid an inifinite loop by indicating when the native `requestFullscreen()` method
	 * is being called.
	 *
	 * Bad Call Stack: host.requestFullscreen() -> controller.requestFullscreen() ->
	 * fscreen.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen() ...
	 *
	 * Good Call Stack: host.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen()
	 * -> (native request fullscreen method on host)
	 */
	isRequestingNativeFullscreen = false;

	/**
	 * This will indicate the orientation to lock the screen to when in fullscreen mode. The default
	 * is `undefined` which indicates no screen orientation change.
	 *
	 * @type {ScreenOrientationLock | undefined}
	 */
	screenOrientationLock;

	/**
	 * @param {import('./types').FullscreenHost} host
	 * @param {ScreenOrientationController} screenOrientationController
	 */
	constructor(host, screenOrientationController) {
		super();

		/**
		 * @protected
		 * @readonly
		 * @type {import('.').FullscreenHost}
		 */
		this.host = host;

		/**
		 * @protected
		 * @readonly
		 * @type {ScreenOrientationController}
		 */
		this.screenOrientationController = screenOrientationController;

		host.addController({
			hostDisconnected: () => {
				this.destroy();
			}
		});
	}

	/**
	 * Whether fullscreen mode can be requested, generally is an API available to do so.
	 *
	 * @returns {boolean}
	 */
	get isSupported() {
		return this.isSupportedNatively;
	}

	/**
	 * Whether the native Fullscreen API is enabled/available.
	 *
	 * @returns {boolean}
	 */
	get isSupportedNatively() {
		return fscreen.fullscreenEnabled;
	}

	/**
	 * Whether the host element is in fullscreen mode.
	 *
	 * @returns {boolean}
	 */
	get isFullscreen() {
		return this.isNativeFullscreen;
	}

	/**
	 * Whether the host element is in fullscreen mode via the native Fullscreen API.
	 *
	 * @returns {boolean}
	 */
	get isNativeFullscreen() {
		if (fscreen.fullscreenElement === this.host) return true;

		try {
			// Throws in iOS Safari...
			return this.host.matches(
				// TODO: `fullscreenPseudoClass` is missing from `@types/fscreen`.
				/** @type {any} */ (fscreen).fullscreenPseudoClass
			);
		} catch (error) {
			return false;
		}
	}

	/**
	 * Dispose of any event listeners and exit fullscreen (if active).
	 *
	 * @protected
	 * @returns {Promise<void>}
	 */
	async destroy() {
		if (this.isFullscreen) await this.exitFullscreen();
		this.disposal.empty();
		super.destroy();
	}

	/**
	 * @protected
	 * @param {(this: HTMLElement, event: Event) => void} handler
	 * @returns {import('../types/utils').Unsubscribe}
	 */
	addFullscreenChangeEventListener(handler) {
		if (!this.isSupported) return noop;
		return listen(/** @type {any} */ (fscreen), 'fullscreenchange', handler);
	}

	/**
	 * @protected
	 * @param {(this: HTMLElement, event: Event) => void} handler
	 * @returns {import('../types/utils').Unsubscribe}
	 */
	addFullscreenErrorEventListener(handler) {
		if (!this.isSupported) return noop;
		return listen(/** @type {any} */ (fscreen), 'fullscreenerror', handler);
	}

	/**
	 * @returns {Promise<void>}
	 */
	async requestFullscreen() {
		if (this.isFullscreen) return;

		this.throwIfNoFullscreenSupport();

		// TODO: Check if PiP is active, if so make sure to exit - need PipController.

		this.disposal.add(
			this.addFullscreenChangeEventListener(
				this.handleFullscreenChange.bind(this)
			)
		);

		this.disposal.add(
			this.addFullscreenErrorEventListener(
				this.handleFullscreenError.bind(this)
			)
		);

		const response = await this.makeEnterFullscreenRequest();
		await this.lockScreenOrientation();
		return response;
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeEnterFullscreenRequest() {
		this.isRequestingNativeFullscreen = true;
		const response = await fscreen.requestFullscreen(this.host);
		this.isRequestingNativeFullscreen = false;
		return response;
	}

	/**
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	handleFullscreenChange(event) {
		if (!this.isFullscreen) this.disposal.empty();
		this.dispatchEvent('fullscreen-change', {
			detail: this.isFullscreen,
			originalEvent: event
		});
	}

	/**
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	handleFullscreenError(event) {
		this.dispatchEvent('error', { originalEvent: event });
	}

	/**
	 * @returns {Promise<void>}
	 */
	async exitFullscreen() {
		if (!this.isFullscreen) return;
		this.throwIfNoFullscreenSupport();
		const response = await this.makeExitFullscreenRequest();
		await this.unlockScreenOrientation();
		return response;
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeExitFullscreenRequest() {
		return fscreen.exitFullscreen();
	}

	/**
	 * @protected
	 * @returns {boolean}
	 */
	shouldOrientScreen() {
		return (
			this.screenOrientationController.canOrient &&
			!isUndefined(this.screenOrientationLock)
		);
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async lockScreenOrientation() {
		if (isUndefined(this.screenOrientationLock) || !this.shouldOrientScreen()) {
			return;
		}

		await this.screenOrientationController.lock(this.screenOrientationLock);
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async unlockScreenOrientation() {
		if (!this.shouldOrientScreen()) return;
		await this.screenOrientationController.unlock();
	}

	/**
	 * @protected
	 * @returns {void}
	 * @throws {Error} - Will throw if Fullscreen API is not enabled or supported.
	 */
	throwIfNoFullscreenSupport() {
		if (this.isSupported) return;
		throw Error(
			'Fullscreen API is not enabled or supported in this environment.'
		);
	}
}
