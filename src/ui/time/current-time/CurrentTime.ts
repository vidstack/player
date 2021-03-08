import { playerContext } from '../../../core';
import { Time } from '../time';

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `duration` property as it's automatically managed.
 *
 * ## Tag
 *
 * @tagname vds-current-time
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element (`<time>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-current-time
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-current-time>
 * ```
 *
 * @example
 * ```css
 * vds-current-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class CurrentTime extends Time {
  label = 'Current time';

  /**
   * @internal
   */
  @playerContext.currentTime.consume()
  duration = playerContext.currentTime.defaultValue;
}
