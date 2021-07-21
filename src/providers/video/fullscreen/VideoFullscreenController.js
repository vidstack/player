import { listen } from '../../../foundation/events/index.js';
import { FullscreenController } from '../../../foundation/fullscreen/index.js';
import { ScreenOrientationController } from '../../../foundation/screen-orientation/index.js';
import { noop } from '../../../utils/unit.js';
import {
  VideoPresentationChangeEvent,
  VideoPresentationController
} from '../presentation/index.js';

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
  constructor(host, screenOrientationController, presentationController) {
    super(host, screenOrientationController);

    /**
     * @protected
     * @readonly
     * @type {VideoPresentationController}
     */
    this._presentationController = presentationController;
  }

  /** @type {boolean} */
  get isFullscreen() {
    return this.isSupportedNatively
      ? this.isNativeFullscreen
      : this._presentationController.isFullscreenMode;
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
    return this._presentationController.isSupported;
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async _makeEnterFullscreenRequest() {
    return this.isSupportedNatively
      ? super._makeEnterFullscreenRequest()
      : this._makeFullscreenRequestOnSafari();
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async _makeFullscreenRequestOnSafari() {
    return this._presentationController.setPresentationMode('fullscreen');
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async _makeExitFullscreenRequest() {
    return this.isSupportedNatively
      ? super._makeExitFullscreenRequest()
      : this._makeExitFullscreenRequestOnSafari();
  }

  /**
   * @protected
   * @returns {Promise<void>}
   */
  async _makeExitFullscreenRequestOnSafari() {
    return this._presentationController.setPresentationMode('inline');
  }

  /**
   * @protected
   * @param {(this: HTMLElement, event: Event) => void} handler
   * @returns {() => void} Stop listening function.
   */
  _addFullscreenChangeEventListener(handler) {
    if (this.isSupportedNatively) {
      return super._addFullscreenChangeEventListener(handler);
    }

    if (this.isSupportedOnSafari) {
      return listen(
        this._host,
        VideoPresentationChangeEvent.TYPE,
        this._handlePresentationModeChange.bind(this)
      );
    }

    return noop;
  }

  /**
   * @protected
   * @param {VideoPresentationChangeEvent} event
   */
  _handlePresentationModeChange(event) {
    this._handleFullscreenChange(event);
  }

  /**
   * @protected
   * @param {(this: HTMLElement, event: Event) => void} handler
   * @returns {() => void} Stop listening function.
   */
  _addFullscreenErrorEventListener(handler) {
    if (!this.isSupportedNatively) return noop;
    return super._addFullscreenErrorEventListener(handler);
  }
}
