import clsx from 'clsx';
import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { VdsElement } from '../../shared/elements/index.js';
import { IS_IOS } from '../../utils/support.js';
import { mediaContext } from '../media.context.js';
import { mediaUiElementStyles } from './css.js';

export const VDS_MEDIA_UI_ELEMENT_TAG_NAME = 'vds-media-ui';

/**
 * Simple container that holds a collection of user interface components.
 *
 * This is a general container to hold your UI components but it also enables you to show/hide
 * the player UI when media is not ready for playback by applying styles to the `root/root-hidden`
 * CSS parts. It also handles showing/hiding UI depending on whether native UI can't be
 * hidden (*cough* iOS).
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the `root-hidden` CSS part.
 *
 * @tagname vds-media-ui
 *
 * @slot Used to pass in UI components.
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart root-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 */
export class MediaUiElement extends VdsElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaUiElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'root-hidden'];
  }

  /** @type {import('../../shared/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      mediaCanPlay: mediaContext.canPlay,
      mediaFullscreen: mediaContext.fullscreen,
      mediaIsVideoView: mediaContext.isVideoView,
      mediaPlaysinline: mediaContext.playsinline
    };
  }

  constructor() {
    super();
    /** @protected @readonly @type {boolean} */
    this.mediaCanPlay = mediaContext.canPlay.initialValue;
    /** @protected @readonly @type {boolean} */
    this.mediaFullscreen = mediaContext.fullscreen.initialValue;
    /** @protected @readonly @type {boolean} */
    this.mediaIsVideoView = mediaContext.isVideoView.initialValue;
    /** @protected @readonly @type {boolean} */
    this.mediaPlaysinline = mediaContext.playsinline.initialValue;
  }

  // -------------------------------------------------------------------------------------------
  // Render
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
        class=${this.getRootClassAttr()}
        part=${this.getRootPartAttr()}
        ${ref(this.rootRef)}
      >
        ${this.renderRootChildren()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root UI container.
   *
   * @protected
   */
  renderRootChildren() {
    return html`${this.renderDefaultSlot()}`;
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
   * Override this to modify root CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  getRootClassAttr() {
    return '';
  }

  /**
   * Override this to modify root CSS parts.
   *
   * @protected
   * @returns {string}
   */
  getRootPartAttr() {
    return clsx({
      root: true,
      'root-hidden': this.isUiHidden()
    });
  }

  /**
   * Whether the UI should be hidden.
   *
   * @protected
   * @returns {boolean}
   */
  isUiHidden() {
    return (
      !this.mediaCanPlay ||
      // If iOS Safari and the view type is currently video then we hide the custom UI depending
      // on whether playsinline is set and fullscreen is not active, or if fullscreen is active
      // we should always hide.
      (IS_IOS &&
        this.mediaIsVideoView &&
        (!this.mediaPlaysinline || this.mediaFullscreen))
    );
  }
}
