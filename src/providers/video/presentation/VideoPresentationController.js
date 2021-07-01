import {
  DisposalBin,
  listen,
  redispatchEvent
} from '../../../foundation/events/index.js';
import { IS_IOS } from '../../../utils/support.js';
import { isFunction, isNil, noop } from '../../../utils/unit.js';

/**
 * @typedef {{
 *  readonly videoElement: HTMLVideoElement | undefined
 * } & import('lit').ReactiveElement} VideoPresentationControllerHost
 */

/**
 * @typedef {{
 *  handlePresentationModeChange?(controller: VideoPresentationController);
 * }} VideoPresentationControllerDelegate
 */

/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 *
 * @example
 * ```ts
 * import { VdsElement } from '@vidstack/elements';
 *
 * class MyElement extends VdsElement {
 *   presentationController = new PresentationController(this);
 *
 *   get videoElement(): HTMLVideoElement | undefined {
 *     return this.videoEl;
 *   }
 * }
 * ```
 */
export class VideoPresentationController {
  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @protected
   * @readonly
   * @type {Set<VideoPresentationControllerDelegate>}
   */
  delegates = new Set();

  /**
   * @param {VideoPresentationControllerHost} host
   * @param {VideoPresentationControllerDelegate} [delegate]
   */
  constructor(host, delegate = {}) {
    /**
     * @type {VideoPresentationControllerHost}
     * @protected
     * @readonly
     */
    this.host = host;

    this.delegates.add(delegate);

    const firstUpdated = /** @type {any} */ (host).firstUpdated;
    /** @type {any} */ (host).firstUpdated = (changedProperties) => {
      firstUpdated?.call(host, changedProperties);
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
   * @param {VideoPresentationControllerDelegate} delegate
   * @returns {(() => void)} Cleanup function to remove delegate.
   */
  addDelegate(delegate) {
    this.delegates.add(delegate);
    return () => {
      this.delegates.delete(delegate);
    };
  }

  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @type {import('../../../foundation/types/media').WebKitPresentationMode | undefined}
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode() {
    return this.host.videoElement?.webkitPresentationMode;
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
    return (
      IS_IOS &&
      isFunction(this.host.videoElement?.webkitSetPresentationMode) &&
      (this.host.videoElement?.webkitSupportsFullscreen ?? false)
    );
  }

  /**
   * @param {import('../../../foundation/types/media').WebKitPresentationMode} mode
   */
  setPresentationMode(mode) {
    this.host.videoElement?.webkitSetPresentationMode?.(mode);
  }

  /**
   * @protected
   * @returns {import('../../../foundation/types/utils').Unsubscribe}
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
    this.delegates.forEach((delegate) => {
      delegate.handlePresentationModeChange?.(this);
    });
  }
}
