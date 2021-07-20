/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import {
 *   FullscreenController,
 *   ScreenOrientationController,
 *   VideoPresentationController
 * } from '@vidstack/jelements';
 *
 * class MyElement extends LitElement {
 *   get videoElement() {
 *     return this.videoEl;
 *   }
 *
 *   fullscreenController = new VideoFullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *     new VideoPresentationController(this),
 *   );
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
     * @param {import('../../../foundation/fullscreen').FullscreenControllerHost} host
     * @param {ScreenOrientationController} screenOrientationController
     * @param {VideoPresentationController} presentationController
     */
    constructor(host: import('../../../foundation/fullscreen').FullscreenControllerHost, screenOrientationController: ScreenOrientationController, presentationController: VideoPresentationController);
    /**
     * @protected
     * @readonly
     * @type {VideoPresentationController}
     */
    protected readonly presentationController: VideoPresentationController;
    /**
     * Whether a fallback fullscreen API is available on Safari using presentation modes. This
     * is only used on iOS where the native fullscreen API is not available.
     *
     * @type {boolean}
     * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
     */
    get isSupportedOnSafari(): boolean;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected makeFullscreenRequestOnSafari(): Promise<void>;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected makeExitFullscreenRequestOnSafari(): Promise<void>;
    /**
     * @protected
     * @param {VideoPresentationChangeEvent} event
     */
    protected handlePresentationModeChange(event: VideoPresentationChangeEvent): void;
}
import { FullscreenController } from "../../../foundation/fullscreen/FullscreenController.js";
import { VideoPresentationController } from "../presentation/VideoPresentationController.js";
import { VideoPresentationChangeEvent } from "../presentation/events.js";
import { ScreenOrientationController } from "../../../foundation/screen-orientation/ScreenOrientationController.js";
