import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { watchContext } from '../../base/context';
import { mediaContext } from '../../media';
import { setAttribute } from '../../utils/dom';
import { bufferingIndicatorElementStyles } from './styles';

export const BUFFERING_INDICATOR_ELEMENT_TAG_NAME = 'vds-buffering-indicator';

/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary data.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 *
 * @tagname vds-buffering-indicator
 * @slot Used to pass in the content to be displayed while buffering.
 * @example
 * ```html
 * <vds-buffering-indicator>
 *   <!-- ... -->
 * </vds-buffering-indicator>
 * ```
 * @example
 * ```css
 * vds-buffering-indicator {
 *   opacity: 0;
 *   transition: opacity 0.3s ease-out;
 *   transition-delay: 500ms;
 * }
 *
 * vds-buffering-indicator[media-waiting],
 * vds-buffering-indicator:not([media-can-play]) {
 *   opacity: 1;
 * }
 * ```
 */
export class BufferingIndicatorElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [bufferingIndicatorElementStyles];
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: boolean) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  @watchContext(mediaContext.waiting)
  protected _handleWaitingContextUpdate(waiting: boolean) {
    setAttribute(this, 'media-waiting', waiting);
  }
}
