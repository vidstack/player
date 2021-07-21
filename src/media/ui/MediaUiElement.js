import clsx from 'clsx';
import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { consumeContext } from '../../foundation/context/index.js';
import { IS_IOS } from '../../utils/support.js';
import { mediaContext } from '../context.js';
import { mediaUiElementStyles } from './styles.js';

export const MEDIA_UI_ELEMENT_TAG_NAME = 'vds-media-ui';

/**
 * Simple container that holds a collection of user interface components.
 *
 * This is a general container to hold your UI components but it also enables you to show/hide
 * the player UI when media is not ready for playback by applying styles to the `root/root-hidden`
 * CSS parts. It also handles showing/hiding UI depending on whether native UI can't be
 * hidden (*cough* iOS).
 *
 * 💡 The styling is left to you, it will only apply the `root-hidden` CSS part.
 *
 * @tagname vds-media-ui
 * @slot Used to pass in UI components.
 * @csspart root - The component's root element (`<div>`).
 * @csspart root-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 */
export class MediaUiElement extends LitElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaUiElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return ['root', 'root-hidden'];
  }

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.canPlay)
  _mediaCanPlay = mediaContext.canPlay.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  _mediaFullscreen = mediaContext.fullscreen.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  _mediaIsVideoView = mediaContext.isVideoView.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  _mediaPlaysinline = mediaContext.playsinline.initialValue;

  // -------------------------------------------------------------------------------------------
  // Render
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
        class=${this._getRootClassAttr()}
        part=${this._getRootPartAttr()}
        ${ref(this._rootRef)}
      >
        ${this._renderRootChildren()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root UI container.
   *
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderRootChildren() {
    return html`${this._renderDefaultSlot()}`;
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

  /**
   * Override this to modify root CSS Classes.
   *
   * @protected
   * @returns {string}
   */
  _getRootClassAttr() {
    return '';
  }

  /**
   * Override this to modify root CSS parts.
   *
   * @protected
   * @returns {string}
   */
  _getRootPartAttr() {
    return clsx({
      root: true,
      'root-hidden': this._isUiHidden()
    });
  }

  /**
   * Whether the UI should be hidden.
   *
   * @protected
   * @returns {boolean}
   */
  _isUiHidden() {
    return (
      !this._mediaCanPlay ||
      // If iOS Safari and the view type is currently video then we hide the custom UI depending
      // on whether playsinline is set and fullscreen is not active, or if fullscreen is active
      // we should always hide.
      (IS_IOS &&
        this._mediaIsVideoView &&
        (!this._mediaPlaysinline || this._mediaFullscreen))
    );
  }
}
