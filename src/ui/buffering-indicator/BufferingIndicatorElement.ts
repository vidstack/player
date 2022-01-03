import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { ElementLogger } from '../../base/logger';
import { hostedMediaStoreSubscription } from '../../media';
import { setAttribute } from '../../utils/dom';
import { bufferingIndicatorElementStyles } from './styles';

/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary data.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
 * - `media-ended`: Applied when playback has reached the end.
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

  /* c8 ignore next */
  protected readonly _logger = __DEV__ && new ElementLogger(this);

  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
    hostedMediaStoreSubscription(this, 'waiting', ($waiting) => {
      setAttribute(this, 'media-waiting', $waiting);
    });
    hostedMediaStoreSubscription(this, 'ended', ($ended) => {
      setAttribute(this, 'media-ended', $ended);
    });
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
