import { property } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { mediaContext } from '../../media/index.js';
import { TimeElement } from '../time/index.js';

export const TIME_DURATION_ELEMENT_TAG_NAME = 'vds-time-duration';

/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @tagname vds-time-duration
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-time-duration
 *   label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-duration>
 * ```
 * @example
 * ```css
 * vds-time-duration::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeDurationElement extends TimeElement {
  label = 'Media duration';

  /**
   * @internal
   */
  @property({ attribute: false, state: true })
  // Duration can be -1 when unknown but we want to display >=0.
  @consumeContext(mediaContext.duration, { transform: (d) => (d >= 0 ? d : 0) })
  seconds = mediaContext.duration.initialValue;
}
