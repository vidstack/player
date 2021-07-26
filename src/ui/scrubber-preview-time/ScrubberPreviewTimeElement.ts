import { consumeContext } from '@base/context';
import { scrubberPreviewContext } from '@ui/scrubber-preview';
import { TimeElement } from '@ui/time';
import { property } from 'lit/decorators.js';

export const SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME =
  'vds-scrubber-preview-time';

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

  /** @internal */
  @property({ attribute: false, state: true })
  @consumeContext(scrubberPreviewContext.time)
  override seconds = scrubberPreviewContext.time.initialValue;
}
