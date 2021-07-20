import {
  DisposalBin,
  listen,
  redispatchEvent
} from '../../../foundation/events/index.js';
import { IS_IOS } from '../../../utils/support.js';
import { isFunction, isNil, noop } from '../../../utils/unit.js';
import { VideoPresentationChangeEvent } from './events.js';
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
   * @param {VideoPresentationControllerHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
    /**
     * @type {VideoPresentationControllerHost}
     * @protected
     * @readonly
     */
    this.host = host;
    const firstUpdated = /** @type {any} */ (host).firstUpdated;
    /** @type {any} */ (host).firstUpdated = (changedProperties) => {
      firstUpdated === null || firstUpdated === void 0
        ? void 0
        : firstUpdated.call(host, changedProperties);
      this.disconnectDisposal.add(
        this.addPresentationModeChangeEventListener()
      );
    };
    host.addController({
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }
  /**
   * @protected
   */
  handleHostDisconnected() {
    this.setPresentationMode('inline');
    this.disconnectDisposal.empty();
  }
  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @type {import('../../../foundation/types').WebKitPresentationMode | undefined}
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode() {
    var _a;
    return (_a = this.host.videoElement) === null || _a === void 0
      ? void 0
      : _a.webkitPresentationMode;
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
    var _a, _b, _c;
    return (
      IS_IOS &&
      isFunction(
        (_a = this.host.videoElement) === null || _a === void 0
          ? void 0
          : _a.webkitSetPresentationMode
      ) &&
      ((_c =
        (_b = this.host.videoElement) === null || _b === void 0
          ? void 0
          : _b.webkitSupportsFullscreen) !== null && _c !== void 0
        ? _c
        : false)
    );
  }
  /**
   * @param {import('../../../foundation/types').WebKitPresentationMode} mode
   */
  setPresentationMode(mode) {
    var _a, _b;
    (_b =
      (_a = this.host.videoElement) === null || _a === void 0
        ? void 0
        : _a.webkitSetPresentationMode) === null || _b === void 0
      ? void 0
      : _b.call(_a, mode);
  }
  /**
   * @protected
   * @returns {import('../../../foundation/types').Unsubscribe}
   */
  addPresentationModeChangeEventListener() {
    if (!this.isSupported || isNil(this.host.videoElement)) return noop;
    return listen(
      this.host.videoElement,
      'webkitpresentationmodechanged',
      this.handlePresentationModeChange.bind(this)
    );
  }
  /**
   * @protected
   * @param {Event} event
   */
  handlePresentationModeChange(event) {
    redispatchEvent(this.host, event);
    this.host.dispatchEvent(
      new VideoPresentationChangeEvent({
        detail:
          /** @type {import('../../../foundation/types').WebKitPresentationMode} */ (
            this.presentationMode
          ),
        originalEvent: event
      })
    );
  }
}
