import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  query,
  TemplateResult,
} from 'lit-element';

import { playerContext } from '../../core';
import { IS_IOS } from '../../utils/support';
import { uiStyles } from './ui.css';

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
 * @tagname vds-ui
 *
 * @slot Used to pass in UI components.
 *
 * @csspart root - The component's root element (`<div>`).
 * @csspart root-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 * @csspart root-audio-view - Applied when the current `viewType` is `audio`.
 * @csspart root-video-view - Applied when the current `viewType` is `video`.
 *
 * @example
 * ```html
 * <vds-video src="/media/video.mp4" poster="/media/poster.png">
 *   <!-- ... -->
 *   <vds-ui>
 *     <!-- ... -->
 *   </vds-ui>
 * </vds-video>
 * ```
 *
 * @example
 * ```css
 * vds-ui::part(root) {
 *   opacity: 1;
 *   visibility: visible;
 *   transition: opacity 0.3s ease-in;
 * }
 *
 * vds-ui::part(root-hidden) {
 *   opacity: 0;
 *   visibility: hidden;
 * }
 * ```
 */
export class Ui extends LitElement {
  @query('#root') rootEl!: HTMLDivElement;

  static get styles(): CSSResultArray {
    return [uiStyles];
  }

  static get parts(): string[] {
    return ['root', 'root-hidden', 'root-audio-view', 'root-video-view'];
  }

  @internalProperty()
  @playerContext.canPlay.consume()
  protected canPlay = playerContext.canPlay.defaultValue;

  @internalProperty()
  @playerContext.isAudioView.consume()
  protected isAudioView = playerContext.isAudioView.defaultValue;

  @internalProperty()
  @playerContext.fullscreen.consume()
  protected isFullscreenActive = playerContext.fullscreen.defaultValue;

  @internalProperty()
  @playerContext.isVideoView.consume()
  protected isVideoView = playerContext.isVideoView.defaultValue;

  @internalProperty()
  @playerContext.playsinline.consume()
  protected playsinline = playerContext.playsinline.defaultValue;

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
    return clsx(
      'root',
      this.isUiHidden() && 'root-hidden',
      this.isAudioView && 'root-audio-view',
      this.isVideoView && 'root-video-view',
    );
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
