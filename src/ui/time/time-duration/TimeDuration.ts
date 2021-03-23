import { playerContext } from '../../../core';
import { Time } from '../time';
import { TimeDurationProps } from './time-duration.types';

/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * ## Tag
 *
 * @tagname vds-time-duration
 *
 * ## CSS Parts
 *
 * @csspart root - The component's root element (`<time>`).
 *
 * ## Examples
 *
 * @example
 * ```html
 * <vds-time-duration
 *   label="Duration"
 *   pad-hours
 *   always-show-hours
 * ></vds-time-duration>
 * ```
 *
 * @example
 * ```css
 * vds-time-duration::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeDuration extends Time implements TimeDurationProps {
  label = 'Duration';

  /**
   * @internal
   */
  @playerContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  seconds = 0;
}
