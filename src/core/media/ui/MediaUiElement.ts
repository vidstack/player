import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  query,
  TemplateResult,
} from 'lit-element';

import { IS_IOS } from '../../../utils/support';
import { mediaContext } from '../media.context';
import { mediaUiElementStyles } from './media-ui.css';

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
export class MediaUiElement extends LitElement {
  @query('#root') rootEl!: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [mediaUiElementStyles];
  }

  static get parts(): string[] {
    return ['root', 'root-hidden'];
  }

  @internalProperty()
  @mediaContext.canPlay.consume()
  protected canPlay = mediaContext.canPlay.defaultValue;

  @internalProperty()
  @mediaContext.fullscreen.consume()
  protected isFullscreenActive = mediaContext.fullscreen.defaultValue;

  @internalProperty()
  @mediaContext.isVideoView.consume()
  protected isVideoView = mediaContext.isVideoView.defaultValue;

  @internalProperty()
  @mediaContext.playsinline.consume()
  protected playsinline = mediaContext.playsinline.defaultValue;

  /**
   * The component's root element.
   *
   * @default HTMLDivElement
   */
  get rootElement(): HTMLDivElement {
    return this.rootEl;
  }

  render(): TemplateResult {
    return html`
      <div
        id="root"
        class="${this.getRootClassAttr()}"
        part="${this.getRootPartAttr()}"
      >
        ${this.renderRootContent()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root UI container.
   */
  protected renderRootContent(): TemplateResult {
    return html`${this.renderDefaultSlot()}`;
  }

  /**
   * Override this to modify rendering of default slot.
   */
  protected renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * Override this to modify root CSS Classes.
   */
  protected getRootClassAttr(): string {
    return '';
  }

  /**
   * Override this to modify root CSS parts.
   */
  protected getRootPartAttr(): string {
    return clsx('root', this.isUiHidden() && 'root-hidden');
  }

  /**
   * Whether the UI should be hidden.
   */
  protected isUiHidden(): boolean {
    return (
      !this.canPlay ||
      // If iOS Safari and the view type is currently video then we hide the custom UI depending
      // on whether playsinline is set and fullscreen is not active, or if fullscreen is active
      // we should always hide.
      (IS_IOS &&
        this.isVideoView &&
        (!this.playsinline || this.isFullscreenActive))
    );
  }
}
