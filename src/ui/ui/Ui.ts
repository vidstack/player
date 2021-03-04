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
 * @csspart ui - The root container element.
 * @csspart ui-hidden - Applied when the media is NOT ready for playback and the UI should be hidden.
 * @csspart ui-audio - Applied when the current `viewType` is `audio`.
 * @csspart ui-video - Applied when the current `viewType` is `video`.
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
 * vds-ui::part(ui) {
 *   opacity: 1;
 *   visibility: visible;
 *   transition: opacity 0.3s ease-in;
 * }
 *
 * vds-ui::part(ui-hidden) {
 *   opacity: 0;
 *   visibility: hidden;
 * }
 * ```
 */
export class Ui extends LitElement {
  public static get styles(): CSSResultArray {
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
      <div class="${this.buildClass()}" part="${this.buildPart()}">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Returns CSS Classes.
   */
  protected buildClass(): string {
    return clsx('ui');
  }

  /**
   * Returns CSS Parts.
   */
  protected buildPart(): string {
    return clsx(
      'ui',
      this.isHidden() && 'ui-hidden',
      this.isAudioView && 'ui-audio',
      this.isVideoView && 'ui-video',
    );
  }

  /**
   * Whether the UI should be hidden.
   */
  protected isHidden(): boolean {
    return !this.isPlaybackReady;
  }
}
