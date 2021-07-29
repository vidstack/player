import { property } from 'lit/decorators.js';

import { consumeContext } from '../../base/context';
import { mediaContext } from '../../media';
import { TimeElement } from '../time';

export const TIME_CURRENT_ELEMENT_TAG_NAME = 'vds-time-current';

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 *
 * @tagname vds-time-current
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time-current
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-current>
 * ```
 * @example
 * ```css
 * vds-time-current::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeCurrentElement extends TimeElement {
  override label = 'Current media time';

  /** @internal */
  @property({ attribute: false, state: true })
  @consumeContext(mediaContext.currentTime)
  override seconds = mediaContext.currentTime.initialValue;
}
