/* c8 ignore start */

import { listen } from '../../../base/events';
import {
  FullscreenController,
  FullscreenControllerHost
} from '../../../base/fullscreen';
import { ScreenOrientationController } from '../../../base/screen-orientation';
import { noop } from '../../../utils/unit';
import {
  VideoPresentationChangeEvent,
  VideoPresentationController
} from '../presentation';

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
  constructor(
    host: FullscreenControllerHost,
    screenOrientationController: ScreenOrientationController,
    protected readonly _presentationController: VideoPresentationController
  ) {
    super(host, screenOrientationController);
  }

  override get isFullscreen(): boolean {
    return this.isSupportedNatively
      ? this.isNativeFullscreen
      : this._presentationController.isFullscreenMode;
  }

  override get isSupported(): boolean {
    return this.isSupportedNatively || this.isSupportedOnSafari;
  }

  /**
   * Whether a fallback fullscreen API is available on Safari using presentation modes. This
   * is only used on iOS where the native fullscreen API is not available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get isSupportedOnSafari() {
    return this._presentationController.isSupported;
  }

  protected override async _makeEnterFullscreenRequest(): Promise<void> {
    return this.isSupportedNatively
      ? super._makeEnterFullscreenRequest()
      : this._makeFullscreenRequestOnSafari();
  }

  protected async _makeFullscreenRequestOnSafari(): Promise<void> {
    return this._presentationController.setPresentationMode('fullscreen');
  }

  protected override async _makeExitFullscreenRequest(): Promise<void> {
    return this.isSupportedNatively
      ? super._makeExitFullscreenRequest()
      : this._makeExitFullscreenRequestOnSafari();
  }

  protected async _makeExitFullscreenRequestOnSafari(): Promise<void> {
    return this._presentationController.setPresentationMode('inline');
  }

  protected override _addFullscreenChangeEventListener(
    handler: (this: HTMLElement, event: Event) => void
  ): () => void {
    if (this.isSupportedNatively) {
      return super._addFullscreenChangeEventListener(handler);
    }

    if (this.isSupportedOnSafari) {
      if (__DEV__) {
        this._logger.info('adding `vds-video-presentation-change` listener');
      }

      return listen(
        this._host,
        'vds-video-presentation-change',
        this._handlePresentationModeChange.bind(this)
      );
    }

    return noop;
  }

  protected _handlePresentationModeChange(
    event: VideoPresentationChangeEvent
  ): void {
    this._handleFullscreenChange(event);
  }

  protected override _addFullscreenErrorEventListener(
    handler: (this: HTMLElement, event: Event) => void
  ): () => void {
    if (!this.isSupportedNatively) return noop;
    return super._addFullscreenErrorEventListener(handler);
  }
}

/* c8 ignore stop */
