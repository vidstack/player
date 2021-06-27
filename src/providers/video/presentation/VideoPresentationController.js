import {
  DisposalBin,
  EventDispatcher,
  listen,
  redispatchEvent
} from '../../../foundation/events/index.js';
import { IS_IOS } from '../../../utils/support.js';
import { isFunction, isNil, noop } from '../../../utils/unit.js';

/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 *
 * @extends EventDispatcher<import('./types').VideoPresentationControllerEvents>
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
export class VideoPresentationController extends EventDispatcher {
  /**
   * @protected
   * @readonly
   */
  disposal = new DisposalBin();

  /**
   * @param {import('./types').VideoPresentationControllerHost} host
   */
  constructor(host) {
    super();

    /**
     * @type {import('./types').VideoPresentationControllerHost}
     * @protected
     * @readonly
     */
    this.host = host;

    const firstUpdated = /** @type {any} */ (host).firstUpdated;
    /** @type {any} */ (host).firstUpdated = (changedProperties) => {
      firstUpdated?.call(host, changedProperties);
      this.disposal.add(this.addPresentationModeChangeEventListener());
    };

    host.addController({
      hostDisconnected: async () => {
        await this.destroy();
      }
    });
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
   * @returns {void}
   */
  setPresentationMode(mode) {
    this.host.videoElement?.webkitSetPresentationMode?.(mode);
  }

  /**
   * @protected
   * @returns {void}
   */
  destroy() {
    this.setPresentationMode('inline');
    this.disposal.empty();
    super.destroy();
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
   * @returns {void}
   */
  handlePresentationModeChange(event) {
    redispatchEvent(this.host, event);
    this.dispatchEvent('presentation-mode-change', {
      detail: this.presentationMode,
      originalEvent: event
    });
  }
}
