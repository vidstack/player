import { property } from 'lit/decorators.js';

import { hostedMediaServiceSubscription } from '../../media';
import { TimeElement } from '../time';

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
  override seconds = 0;

  constructor() {
    super();
    hostedMediaServiceSubscription(this, ({ context }) => {
      this.seconds = context.currentTime;
    });
  }
}
