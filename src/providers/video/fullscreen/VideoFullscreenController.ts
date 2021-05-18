import {
	FullscreenController,
	FullscreenControllerHost,
	ScreenOrientationController
} from '../../../core';
import { VdsCustomEvent } from '../../../shared/events';
import { WebKitPresentationMode } from '../../../types/media';
import { Unsubscribe } from '../../../types/misc';
import { noop } from '../../../utils/unit';
import { VideoPresentationController } from '../presentation/VideoPresentationController';

/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 *
 * @example
 * ```ts
 * class MyElement extends LitElement implements
 *   FullscreenControllerHost,
 *   PresentationControllerHost,
 *   ScreenOrientationControllerHost {
 *   fullscreenController = new VideoFullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *     new PresentationController(this),
 *   );
 *
 *   get videoElement(): HTMLVideoElement | undefined {
 *     return this.videoEl;
 *   }
 *
 *   requestFullscreen(): Promise<void> {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   exitFullscreen(): Promise<void> {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class VideoFullscreenController extends FullscreenController {
	constructor(
		protected host: FullscreenControllerHost,
		protected screenOrientationController: ScreenOrientationController,
		protected presentationController: VideoPresentationController
	) {
		super(host, screenOrientationController);
	}

	get isFullscreen(): boolean {
		return this.isSupportedNatively
			? this.isNativeFullscreen
			: this.presentationController.isFullscreenMode;
	}

	get isSupported(): boolean {
		return this.isSupportedNatively || this.isSupportedOnSafari;
	}

	/**
	 * Whether a fallback fullscreen API is available on Safari using presentation modes. This
	 * is only used on iOS where the native fullscreen API is not available.
	 *
	 * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
	 */
	get isSupportedOnSafari(): boolean {
		return this.presentationController.isSupported;
	}

	protected async makeEnterFullscreenRequest(): Promise<void> {
		return this.isSupportedNatively
			? super.makeEnterFullscreenRequest()
			: this.makeFullscreenRequestOnSafari();
	}

	protected async makeFullscreenRequestOnSafari(): Promise<void> {
		return this.presentationController.setPresentationMode('fullscreen');
	}

	protected async makeExitFullscreenRequest(): Promise<void> {
		return this.isSupportedNatively
			? super.makeExitFullscreenRequest()
			: this.makeExitFullscreenRequestOnSafari();
	}

	protected async makeExitFullscreenRequestOnSafari(): Promise<void> {
		return this.presentationController.setPresentationMode('inline');
	}

	protected addFullscreenChangeEventListener(
		handler: (this: HTMLElement, event: Event) => void
	): Unsubscribe {
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

	protected handlePresentationModeChange(
		originalEvent: VdsCustomEvent<WebKitPresentationMode>
	): void {
		this.handleFullscreenChange(originalEvent);
	}

	protected addFullscreenErrorEventListener(
		handler: (this: HTMLElement, event: Event) => void
	): Unsubscribe {
		if (!this.isSupportedNatively) return noop;
		return super.addFullscreenErrorEventListener(handler);
	}
}
