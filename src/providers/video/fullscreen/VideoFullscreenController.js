import { VdsCustomEvent } from '../../../shared/events/index.js';
import { FullscreenController } from '../../../shared/fullscreen/index.js';
import { ScreenOrientationController } from '../../../shared/screen-orientation/index.js';
import { noop } from '../../../utils/unit.js';
import { VideoPresentationController } from '../presentation/VideoPresentationController.js';

/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 *
 * @example
 * ```ts
 * import {
 *   VdsElement,
 *   FullscreenController,
 *   ScreenOrientationController,
 *   VideoPresentationController
 * } from '@vidstack/elements';
 *
 * class MyElement extends VdsElement {
 *   fullscreenController = new VideoFullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *     new VideoPresentationController(this),
 *   );
 *
 *   get videoElement() {
 *     return this.videoEl;
 *   }
 *
 *   async requestFullscreen() {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   async exitFullscreen() {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class VideoFullscreenController extends FullscreenController {
	/**
	 * @param {import('../../../shared/fullscreen').FullscreenHost} host
	 * @param {ScreenOrientationController} screenOrientationController
	 * @param {VideoPresentationController} presentationController
	 */
	constructor(host, screenOrientationController, presentationController) {
		super(host, screenOrientationController);

		/**
		 * @protected
		 * @readonly
		 * @type {VideoPresentationController}
		 */
		this.presentationController = presentationController;
	}

	/** @type {boolean} */
	get isFullscreen() {
		return this.isSupportedNatively
			? this.isNativeFullscreen
			: this.presentationController.isFullscreenMode;
	}

	/** @type {boolean} */
	get isSupported() {
		return this.isSupportedNatively || this.isSupportedOnSafari;
	}

	/**
	 * Whether a fallback fullscreen API is available on Safari using presentation modes. This
	 * is only used on iOS where the native fullscreen API is not available.
	 *
	 * @type {boolean}
	 * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
	 */
	get isSupportedOnSafari() {
		return this.presentationController.isSupported;
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeEnterFullscreenRequest() {
		return this.isSupportedNatively
			? super.makeEnterFullscreenRequest()
			: this.makeFullscreenRequestOnSafari();
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeFullscreenRequestOnSafari() {
		return this.presentationController.setPresentationMode('fullscreen');
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeExitFullscreenRequest() {
		return this.isSupportedNatively
			? super.makeExitFullscreenRequest()
			: this.makeExitFullscreenRequestOnSafari();
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async makeExitFullscreenRequestOnSafari() {
		return this.presentationController.setPresentationMode('inline');
	}

	/**
	 * @protected
	 * @param {(this: HTMLElement, event: Event) => void} handler
	 * @returns {import('../../../shared/types/utils').Unsubscribe}
	 */
	addFullscreenChangeEventListener(handler) {
		if (this.isSupportedNatively) {
			return super.addFullscreenChangeEventListener(handler);
		}

		if (this.isSupportedOnSafari) {
			return this.presentationController.addEventListener(
				'presentation-mode-change',
				this.handlePresentationModeChange.bind(this)
			);
		}

		return noop;
	}

	/**
	 * @protected
	 * @param {VdsCustomEvent<import('../../../shared/types/media').WebKitPresentationMode>} event
	 * @returns {void}
	 */
	handlePresentationModeChange(event) {
		this.handleFullscreenChange(event);
	}

	/**
	 * @protected
	 * @param {(this: HTMLElement, event: Event) => void} handler
	 * @returns {import('../../../shared/types/utils').Unsubscribe}
	 */
	addFullscreenErrorEventListener(handler) {
		if (!this.isSupportedNatively) return noop;
		return super.addFullscreenErrorEventListener(handler);
	}
}
