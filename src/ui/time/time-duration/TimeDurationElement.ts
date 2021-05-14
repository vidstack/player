import { mediaContext } from '../../../core';
import { TimeElement } from '../time';
import { TimeDurationElementProps } from './time-duration.types';

/**
 * Formats and displays the `duration` of the current media. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @tagname vds-time-duration
 *
 * @csspart root - The component's root element (`<time>`).
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
export class TimeDurationElement
  extends TimeElement
  implements TimeDurationElementProps {
  label = 'Duration';

  /**
   * @internal
   */
  @mediaContext.duration.consume({ transform: d => (d >= 0 ? d : 0) })
  seconds = 0;
}
