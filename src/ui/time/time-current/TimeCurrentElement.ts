import { mediaContext } from '../../../core';
import { TimeElement } from '../time';
import { TimeCurrentElementProps } from './time-current.types';

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
export class TimeCurrentElement
  extends TimeElement
  implements TimeCurrentElementProps {
  label = 'Current time';

  /**
   * @internal
   */
  @mediaContext.currentTime.consume()
  seconds = mediaContext.currentTime.defaultValue;
}
