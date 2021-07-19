import clsx from 'clsx';
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { consumeContext } from '../../foundation/context/index.js';
import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import {
  FullscreenChangeEvent,
  FullscreenController
} from '../../foundation/fullscreen/index.js';
import { ScreenOrientationController } from '../../foundation/screen-orientation/index.js';
import { getSlottedChildren } from '../../utils/dom.js';
import { isNil, isString, isUndefined } from '../../utils/unit.js';
import { mediaContext } from '../context.js';
import {
  MediaProviderConnectEvent,
  MediaProviderElement
} from '../provider/index.js';
import { mediaContainerElementStyles } from './styles.js';

export const MEDIA_CONTAINER_ELEMENT_TAG_NAME = `vds-media-container`;

/**
 * Fired when the media container connects to the DOM.
 *
 * @bubbles
 * @composed
 * @augments {DiscoveryEvent<MediaContainerElement>}
 */
export class MediaContainerConnectEvent extends DiscoveryEvent {
  /** @readonly */
  static TYPE = 'vds-media-container-connect';
}

/**
 * Simple container for a media provider and the media user interface (UI).
 *
 *
 * @tagname vds-media-container
 * @slot Used to pass in UI components.
 * @slot media - Used to pass in a media provider element.
 * @csspart root - The component's root element (`<div>`).
 * @csspart media - The media container element (`<div>`).
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

  /** @type {string[]} */
  static get events() {
    return [MediaContainerConnectEvent.TYPE];
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
  mediaCanPlay = false;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.fullscreen)
  mediaFullscreen = false;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.isVideoView)
  mediaIsVideoView = false;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  discoveryController = new ElementDiscoveryController(
    this,
    MediaContainerConnectEvent
  );

  /**
   * @protected
   * @readonly
   */
  eventListenerController = new EventListenerController(this, {
    [FullscreenChangeEvent.TYPE]: this.handleFullscreenChange,
    [MediaProviderConnectEvent.TYPE]: this.handleMediaProviderConnect
  });

  // -------------------------------------------------------------------------------------------
  // Render - Root
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLDivElement}
   */
  get rootElement() {
    return /** @type {HTMLDivElement} */ (this.rootRef.value);
  }

  render() {
    return html`
      <div
        id="root"
        aria-busy=${this.getAriaBusy()}
        class=${this.getRootClassAttr()}
        part=${this.getRootPartAttr()}
        style=${styleMap(this.getRootStyleMap())}
        ${ref(this.rootRef)}
      >
        ${this.renderRootChildren()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root cotnainer.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderRootChildren() {
    return html`${this.renderMedia()}${this.renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  /**
   * Override this to modify root container CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  getRootClassAttr() {
    return clsx({
      'with-aspect-ratio': this.shouldApplyAspectRatio()
    });
  }

  /**
   * Override this to modify root container CSS parts.
   *
   * @protected
   * @returns {string}
   */
  getRootPartAttr() {
    return 'root';
  }

  /**
   * Override this to modify root container styles.
   *
   * @protected
   * @returns {import('lit/directives/style-map').StyleInfo}
   */
  getRootStyleMap() {
    return {
      'padding-bottom': this.getAspectRatioPadding()
    };
  }

  /**
   * @protected
   * @returns {'true' | 'false'}
   */
  getAriaBusy() {
    return this.mediaCanPlay ? 'false' : 'true';
  }

  // -------------------------------------------------------------------------------------------
  // Aspect Ratio
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {boolean}
   */
  shouldApplyAspectRatio() {
    return (
      this.mediaIsVideoView &&
      !this.mediaFullscreen &&
      isString(this.aspectRatio) &&
      /\d{1,2}:\d{1,2}/.test(this.aspectRatio)
    );
  }

  /**
   * @protected
   * @returns {number}
   */
  calcAspectRatio() {
    if (!this.shouldApplyAspectRatio()) return NaN;
    const [width, height] = (this.aspectRatio ?? '16:9').split(':');
    return (100 / Number(width)) * Number(height);
  }

  /**
   * @protected
   * @param {string} maxPadding
   * @returns {string | undefined}
   */
  getAspectRatioPadding(maxPadding = '100vh') {
    const ratio = this.calcAspectRatio();
    if (isNaN(ratio)) return undefined;
    return `min(${maxPadding}, ${this.calcAspectRatio()}%)`;
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
  mediaContainerRef = createRef();

  /**
   * The media container element.
   *
   * @type {HTMLDivElement}
   */
  get mediaContainerElement() {
    return /** @type {HTMLDivElement} */ (this.mediaContainerRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderMedia() {
    return html`
      <div
        id="media-container"
        part="${this.getMediaPartAttr()}"
        ${ref(this.mediaContainerRef)}
      >
        ${this.renderMediaSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getMediaPartAttr() {
    return 'media';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderMediaSlot() {
    return html` <slot
      name="${this.getMediaSlotName()}"
      @slotchange="${this.handleMediaSlotChange}"
    ></slot>`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getMediaSlotName() {
    return 'media';
  }

  /**
   * @protected
   * @type {boolean}
   */
  hasMediaProviderConnectedViaEvent = false;

  /**
   * @protected
   */
  handleMediaSlotChange() {
    if (this.hasMediaProviderConnectedViaEvent) return;

    const mediaProvider = /** @type {MediaProviderElement} */ (
      getSlottedChildren(this, this.getMediaSlotName())[0]
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
   * @param {MediaProviderConnectEvent} event
   */
  handleMediaProviderConnect(event) {
    const { element, onDisconnect } = event.detail;

    this._mediaProvider = element;
    this.hasMediaProviderConnectedViaEvent = true;

    onDisconnect(() => {
      this._mediaProvider = undefined;
      this.hasMediaProviderConnectedViaEvent = false;
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
    if (this.shouldFullscreenMediaProvider()) {
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
    if (this.shouldFullscreenMediaProvider()) {
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
  shouldFullscreenMediaProvider() {
    return (
      !this.fullscreenController.isSupportedNatively &&
      !isNil(this.mediaProvider)
    );
  }

  /**
   * @protected
   * @param {FullscreenChangeEvent} event
   */
  handleFullscreenChange(event) {
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.context.fullscreen = event.detail;
    }
  }
}
