import {
  DisposalBin,
  listen,
  redispatchEvent,
  vdsEvent
} from '@base/events/index.js';
import { isFunction, isNil, noop } from '@utils/unit.js';

/**
 * @typedef {{
 *  readonly videoElement: HTMLVideoElement | undefined
 * } & import('lit').ReactiveElement} VideoPresentationControllerHost
 */

/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { VideoPresentationController } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   get videoElement(): HTMLVideoElement | undefined {
 *     return this.videoEl;
 *   }
 *
 *   presentationController = new VideoPresentationController(this);
 * }
 * ```
 */
export class VideoPresentationController {
  /**
   * @protected
   * @readonly
   */
  _disconnectDisposal = new DisposalBin();

  /**
   * @param {VideoPresentationControllerHost} host
   */
  constructor(host) {
    /**
     * @type {VideoPresentationControllerHost}
     * @protected
     * @readonly
     */
    this._host = host;

    const firstUpdated = /** @type {any} */ (host).firstUpdated;
    /** @type {any} */ (host).firstUpdated = (changedProperties) => {
      firstUpdated?.call(host, changedProperties);
      this._disconnectDisposal.add(
        this._addPresentationModeChangeEventListener()
      );
    };

    host.addController({
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  _handleHostDisconnected() {
    this.setPresentationMode('inline');
    this._disconnectDisposal.empty();
  }

  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @type {WebKitPresentationMode | undefined}
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode() {
    return this._host.videoElement?.webkitPresentationMode;
  }

  /**
   * @type {boolean}
   * Whether the current `presentationMode` is `inline`.
   */
  get isInlineMode() {
    return this.presentationMode === 'inline';
  }

  /**
   * Whether the current `presentationMode` is `picture-in-picture`.
   *
   * @type {boolean}
   */
  get isPictureInPictureMode() {
    return this.presentationMode === 'inline';
  }

  /**
   * Whether the current `presentationMode` is `fullscreen`.
   *
   * @type {boolean}
   */
  get isFullscreenMode() {
    return this.presentationMode === 'fullscreen';
  }

  /**
   * Whether the presentation mode API is available.
   *
   * @type {boolean}
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
   */
  get isSupported() {
    return isFunction(this._host.videoElement?.webkitSetPresentationMode);
  }

  /**
   * @param {WebKitPresentationMode} mode
   */
  setPresentationMode(mode) {
    this._host.videoElement?.webkitSetPresentationMode?.(mode);
  }

  /**
   * @protected
   * @returns {() => void} Stop listening function.
   */
  _addPresentationModeChangeEventListener() {
    if (!this.isSupported || isNil(this._host.videoElement)) return noop;
    return listen(
      this._host.videoElement,
      // @ts-expect-error
      'webkitpresentationmodechanged',
      this._handlePresentationModeChange.bind(this)
    );
  }

  /**
   * @protected
   * @param {Event} event
   */
  _handlePresentationModeChange(event) {
    redispatchEvent(this._host, event);
    this._host.dispatchEvent(
      vdsEvent('vds-video-presentation-change', {
        detail: /** @type {WebKitPresentationMode} */ (this.presentationMode),
        originalEvent: event
      })
    );
  }
}
