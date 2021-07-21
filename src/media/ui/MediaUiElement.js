import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { setAttribute } from '../../utils/dom.js';
import { IS_IOS } from '../../utils/support.js';
import { mediaContext } from '../context.js';
import { mediaUiElementStyles } from './styles.js';

export const MEDIA_UI_ELEMENT_TAG_NAME = 'vds-media-ui';

/**
 * Simple container that holds a collection of user interface components.
 *
 * This is a general container to hold your UI components but it also enables you to show/hide
 * the player UI when media is not ready for playback by applying styles when the `hidden`
 * attribute is present. It also handles showing/hiding UI depending on whether native UI can't be
 * hidden (*cough* iOS).
 *
 * 💡 The styling is left to you, it will only apply the `hidden` attribute.
 *
 * @tagname vds-media-ui
 * @slot Used to pass in UI components.
 * @example
 * ```html
 * <vds-ui>
 *   <!-- ... -->
 * </vds-ui>
 * ```
 * @example
 * ```css
 * vds-ui {
 *   opacity: 1;
 *   transition: opacity 0.3s ease-out;
 * }
 *
 * vds-ui[hidden] {
 *   display: block;
 *   opacity: 0;
 * }
 * ```
 */
export class MediaUiElement extends LitElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [mediaUiElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    return [];
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
  @consumeContext(mediaContext.fullscreen)
  _mediaFullscreen = mediaContext.fullscreen.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.isVideoView)
  _mediaIsVideoView = mediaContext.isVideoView.initialValue;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.playsinline)
  _mediaPlaysinline = mediaContext.playsinline.initialValue;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    setAttribute(this, 'hidden', this._isUiHidden());
    super.update(changedProperties);
  }

  render() {
    return this._renderDefaultSlot();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderDefaultSlot() {
    return html`<slot></slot>`;
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
