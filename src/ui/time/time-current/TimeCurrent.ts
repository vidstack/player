import { playerContext } from '../../../core';
import { Time } from '../time';

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `duration` property as it's automatically managed.
 *
 * ## Tag
 *
 * @tagname vds-time-current
 *
 * ## CSS Parts
 *
 * @csspart root - The root component element (`<time>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-time-current
 *   label="Current time"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-current>
 * ```
 *
 * @example
 * ```css
 * vds-time-current::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeCurrent extends Time {
  label = 'Current time';

  /**
   * @internal
   */
  @playerContext.currentTime.consume()
  duration = playerContext.currentTime.defaultValue;
}
