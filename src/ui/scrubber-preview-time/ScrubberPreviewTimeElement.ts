import { property } from 'lit/decorators.js';

import { hostedServiceSubscription } from '../../base/machine';
import { scrubberPreviewContext } from '../scrubber-preview';
import { TimeElement } from '../time';

/**
 * Formats and displays the current scrubber preview time. The preview time is the point at which
 * the user is hovering or dragging the scrubber thumb converted into a current media time
 * position.
 *
 * 🚨 Do not mess with the component's `seconds` property as it's automatically managed.
 *
 * @tagname vds-scrubber-preview-time
 * @csspart root - The component's root element (`<time>`).
 * @example
 * ```html
 * <vds-scrubber>
 *   <vds-scrubber-preview>
 *     <vds-scrubber-preview-time
 *       label="Media scrubber preview time"
 *       pad-hours
 *       always-show-hours
 *     ></vds-scrubber-preview-time>
 *   </vds-scrubber-preview>
 * </vds-scrubber>
 * ```
 * @example
 * ```css
 * vds-scrubber-preview-time {
 *   bottom: 56px;
 * }
 * ```
 */
export class ScrubberPreviewTimeElement extends TimeElement {
  override label = 'Media scrubber preview time';

  @property({ attribute: false, state: true }) override seconds = 0;

  constructor() {
    super();
    hostedServiceSubscription(this, scrubberPreviewContext, ({ context }) => {
      this.seconds = context.time;
    });
  }
}
