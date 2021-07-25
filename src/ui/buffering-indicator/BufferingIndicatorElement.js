import { html, LitElement } from 'lit';

import { watchContext } from '../../foundation/context/index.js';
import { mediaContext } from '../../media/index.js';
import { setAttribute } from '../../utils/dom.js';
import { bufferingIndicatorElementStyles } from './styles.js';

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
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [bufferingIndicatorElementStyles];
  }

  /** @returns {import('lit').TemplateResult} */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @param {boolean} canPlay
   */
  @watchContext(mediaContext.canPlay)
  _handleCanPlayContextUpdate(canPlay) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  /**
   * @protected
   * @param {boolean} waiting
   */
  @watchContext(mediaContext.waiting)
  _handleWaitingContextUpdate(waiting) {
    setAttribute(this, 'media-waiting', waiting);
  }
}
