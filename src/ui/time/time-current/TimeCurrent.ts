import { playerContext } from '../../../core';
import { Time } from '../time';
import { TimeCurrentProps } from './time-current.types';

/**
 * Formats and displays the `currentTime` of media playback. Do not mess with the component's
 * `seconds` property as it's automatically managed.
 *
 * @tagname vds-time-current
 *
 * @csspart root - The component's root element (`<time>`).
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
export class TimeCurrent extends Time implements TimeCurrentProps {
  label = 'Current time';

  /**
   * @internal
   */
  @playerContext.currentTime.consume()
  seconds = playerContext.currentTime.defaultValue;
}
