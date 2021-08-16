import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { state } from 'lit/decorators.js';

import { consumeContext } from '../../base/context';
import { setAttribute } from '../../utils/dom';
import { IS_IOS } from '../../utils/support';
import { mediaContext } from '../context';
import { mediaUiElementStyles } from './styles';

export const MEDIA_UI_ELEMENT_TAG_NAME = 'vds-media-ui';

/**
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
 * <vds-media-ui>
 *   <!-- ... -->
 * </vds-media-ui>
 * ```
 * @example
 * ```css
 * vds-media-ui {
 *   opacity: 1;
 *   transition: opacity 0.3s ease-out;
 * }
 *
 * vds-media-ui[hidden] {
 *   display: block;
 *   opacity: 0;
 * }
 * ```
 */
export class MediaUiElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [mediaUiElementStyles];
  }

  static get parts(): string[] {
    return [];
  }

  @state()
  @consumeContext(mediaContext.canPlay)
  protected _mediaCanPlay = mediaContext.canPlay.initialValue;

  @state()
  @consumeContext(mediaContext.fullscreen)
  protected _mediaFullscreen = mediaContext.fullscreen.initialValue;

  @state()
  @consumeContext(mediaContext.isVideoView)
  protected _mediaIsVideoView = mediaContext.isVideoView.initialValue;

  @state()
  @consumeContext(mediaContext.playsinline)
  protected _mediaPlaysinline = mediaContext.playsinline.initialValue;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    setAttribute(this, 'hidden', this._isUiHidden());
    super.update(changedProperties);
  }

  protected override render(): TemplateResult {
    return this._renderDefaultSlot();
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * Whether the UI should be hidden.
   */
  protected _isUiHidden(): boolean {
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
