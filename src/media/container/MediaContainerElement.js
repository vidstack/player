import clsx from 'clsx';
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { consumeContext } from '../../foundation/context/index.js';
import { ElementDiscoveryController } from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import { FullscreenController } from '../../foundation/fullscreen/index.js';
import { ScreenOrientationController } from '../../foundation/screen-orientation/index.js';
import { getSlottedChildren } from '../../utils/dom.js';
import { isNil, isString, isUndefined } from '../../utils/unit.js';
import { mediaContext } from '../context.js';
import { MediaProviderElement } from '../provider/MediaProviderElement.js';
import { mediaContainerElementStyles } from './styles.js';

export const MEDIA_CONTAINER_ELEMENT_TAG_NAME = `vds-media-container`;

/**
 * Fired when the media container connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {import('../../foundation/elements').DiscoveryEvent<MediaContainerElement>} MediaContainerConnectEvent
 */

/**
 * Simple container for a media provider and the media user interface (UI).
 *
 *
 * @tagname vds-media-container
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 * @csspart root - The component's root element (`<div>`).
 * @csspart media-container - The media container element (`<div>`).
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *     >
 *       <!-- ... -->
 *     </vds-video>
 *
 *     <vds-media-ui>
 *       <!-- UI components here. -->
 *     </vds-media-ui>
 *   </vds-media-container>
 * </vds-media-controller>
 * ```
 */
export class MediaContainerElement extends LitElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaContainerElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'media'];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
   *
   * @type {string | undefined}
   */
  @property({ attribute: 'aspect-ratio' }) aspectRatio;

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.canPlay)
  _mediaCanPlay = false;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.fullscreen)
  _mediaFullscreen = false;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.isVideoView)
  _mediaIsVideoView = false;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  _discoveryController = new ElementDiscoveryController(this, {
    eventType: 'vds-media-container-connect'
  });

  /**
   * @protected
   * @readonly
   */
  _eventListenerController = new EventListenerController(this, {
    'vds-fullscreen-change': this._handleFullscreenChange,
    'vds-media-provider-connect': this._handleMediaProviderConnect
  });

  // -------------------------------------------------------------------------------------------
  // Render - Root
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLDivElement}
   */
  get rootElement() {
    return /** @type {HTMLDivElement} */ (this._rootRef.value);
  }

  render() {
    return html`
      <div
        id="root"
        aria-busy=${this._mediaCanPlay ? 'false' : 'true'}
        class=${clsx({
          'with-aspect-ratio': this._shouldApplyAspectRatio()
        })}
        part="root"
        style=${styleMap({
          'padding-bottom': this._getAspectRatioPadding()
        })}
        ${ref(this._rootRef)}
      >
        ${this._renderRootChildren()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root cotnainer.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderRootChildren() {
    return html`${this._renderMedia()}${this._renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Aspect Ratio
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {boolean}
   */
  _shouldApplyAspectRatio() {
    return (
      this._mediaIsVideoView &&
      !this._mediaFullscreen &&
      isString(this.aspectRatio) &&
      /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
    );
  }

  /**
   * @protected
   * @returns {number}
   */
  _calcAspectRatio() {
    if (!this._shouldApplyAspectRatio()) return NaN;
    const [width, height] = (this.aspectRatio ?? '16:9').split(':');
    return (100 / Number(width)) * Number(height);
  }

  /**
   * @protected
   * @param {string} maxPadding
   * @returns {string | undefined}
   */
  _getAspectRatioPadding(maxPadding = '100vh') {
    const ratio = this._calcAspectRatio();
    if (isNaN(ratio)) return undefined;
    return `min(${maxPadding}, ${this._calcAspectRatio()}%)`;
  }

  // -------------------------------------------------------------------------------------------
  // Render - Media
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {MediaProviderElement | undefined}
   */
  _mediaProvider;

  get mediaProvider() {
    return this._mediaProvider;
  }

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  _mediaContainerRef = createRef();

  /**
   * The media container element.
   *
   * @type {HTMLDivElement}
   */
  get mediaContainerElement() {
    return /** @type {HTMLDivElement} */ (this._mediaContainerRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderMedia() {
    return html`
      <div
        id="media-container"
        part="media-container"
        ${ref(this._mediaContainerRef)}
      >
        ${this._renderMediaSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderMediaSlot() {
    return html`
      <slot name="media" @slotchange="${this._handleMediaSlotChange}"></slot>
    `;
  }

  /**
   * @protected
   * @type {boolean}
   */
  _hasMediaProviderConnectedViaEvent = false;

  /**
   * @protected
   */
  _handleMediaSlotChange() {
    if (this._hasMediaProviderConnectedViaEvent) return;

    const mediaProvider = /** @type {MediaProviderElement} */ (
      getSlottedChildren(this, 'media')[0]
    );

    // Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
    // wrong element.
    if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
      throw Error('Invalid media element given to `media` slot.');
    }

    this._mediaProvider = mediaProvider;
  }

  /**
   * @protected
   * @param {import('../provider/MediaProviderElement').MediaProviderConnectEvent} event
   */
  _handleMediaProviderConnect(event) {
    const { element, onDisconnect } = event.detail;

    this._mediaProvider = element;
    this._hasMediaProviderConnectedViaEvent = true;

    onDisconnect(() => {
      this._mediaProvider = undefined;
      this._hasMediaProviderConnectedViaEvent = false;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * @readonly
   */
  fullscreenController = new FullscreenController(
    this,
    new ScreenOrientationController(this)
  );

  /**
   * @returns {Promise<void>}
   */
  async requestFullscreen() {
    if (this._shouldFullscreenMediaProvider()) {
      return this.mediaProvider?.requestFullscreen();
    }

    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  /**
   * @returns {Promise<void>}
   */
  async exitFullscreen() {
    if (this._shouldFullscreenMediaProvider()) {
      return this.mediaProvider?.exitFullscreen();
    }

    return this.fullscreenController.exitFullscreen();
  }

  /**
   * Whether to fallback to attempting fullscreen directly on the media provider if the native
   * Fullscreen API is not available. For example, on iOS Safari this will handle managing
   * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
   *
   * @protected
   * @returns {boolean}
   */
  _shouldFullscreenMediaProvider() {
    return (
      !this.fullscreenController.isSupportedNatively &&
      !isNil(this.mediaProvider)
    );
  }

  /**
   * @protected
   * @param {import('../../foundation/fullscreen').FullscreenChangeEvent} event
   */
  _handleFullscreenChange(event) {
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.ctx.fullscreen = event.detail;
    }
  }
}
