import clsx from 'clsx';
import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';

import { playerContext } from '../../core';
import { uiStyles } from './ui.css';

/**
 * Simple container that holds a collection of user interface components.
 *
 * This is a general container to hold your UI components but it also enables you to show/hide
 * the player UI when media is not ready for playback by applying styles to the `ui/ui-hidden`
 * CSS parts. It might contain future enhancements such as show/hiding UI depending on whether
 * native UI can't be hidden (*cough* iOS).
 *
 * **Important:** The styling is left to you, it will only apply the `ui-hidden` CSS part.
 *
 * ## Tag
 *
 * @tagname vds-ui
 *
 * ## Slots
 *
 * @slot Used to pass in UI components.
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element (`<div>`).
 * @csspart root-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 * @csspart root-audio - Applied when the current `viewType` is `audio`.
 * @csspart root-video - Applied when the current `viewType` is `video`.
 *
 * ## Examples
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
  static get styles(): CSSResultArray {
    return [uiStyles];
  }

  @internalProperty()
  @playerContext.isPlaybackReady.consume()
  protected isPlaybackReady = playerContext.isPlaybackReady.defaultValue;

  @internalProperty()
  @playerContext.isAudioView.consume()
  protected isAudioView = playerContext.isAudioView.defaultValue;

  @internalProperty()
  @playerContext.isVideoView.consume()
  protected isVideoView = playerContext.isVideoView.defaultValue;

  render(): TemplateResult {
    return html`
      <div
        class="${this.buildRootClassAttr()}"
        part="${this.buildRootPartAttr()}"
      >
        ${this.renderRootContent()}
      </div>
    `;
  }

  /**
   * Override this to modify the content rendered inside the root UI container.
   */
  protected renderRootContent(): TemplateResult {
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
  }

  /**
   * Override this to modify root UI CSS Classes.
   */
  protected buildRootClassAttr(): string {
    return 'root';
  }

  /**
   * Override this to modify root UI CSS parts.
   */
  protected buildRootPartAttr(): string {
    return clsx(
      'root',
      this.isUiHidden() && 'root-hidden',
      this.isAudioView && 'root-audio-ui',
      this.isVideoView && 'root-video-ui',
    );
  }

  /**
   * Whether the UI should be hidden.
   */
  protected isUiHidden(): boolean {
    return !this.isPlaybackReady;
  }

  /**
   * Override to listen to slot changes.
   */
  protected handleDefaultSlotChange(): void {
    // no-op
  }
}
