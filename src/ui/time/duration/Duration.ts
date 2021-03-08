import { playerContext } from '../../../core';
import { Time } from '../time';

/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `duration` property as it's automatically managed.
 *
 * ## Tag
 *
 * @tagname vds-duration
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element (`<time>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-duration
 *   label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-duration>
 * ```
 *
 * @example
 * ```css
 * vds-duration::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class Duration extends Time {
  label = 'Duration';

  /**
   * @internal
   */
  @playerContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  duration = 0;
}
