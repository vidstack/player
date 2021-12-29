import { property } from 'lit/decorators.js';

import { subscribeToMediaService } from '../../media';
import { TimeElement } from '../time';

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
  override label = 'Media duration';

  /** @internal */
  @property({ attribute: false, state: true }) override seconds = 0;

  constructor() {
    super();
    subscribeToMediaService(this, ({ context }) => {
      this.seconds = context.duration >= 0 ? context.duration : 0;
    });
  }
}
