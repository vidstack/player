import type { HTMLCustomElement } from 'maverick.js/element';

export interface TimeProps {
  /**
   * The type of media time to track.
   */
  type: 'current' | 'buffered' | 'duration' | 'seekable';
  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour.
   *
   * @example `20:30 -> 0:20:35`
   */
  showHours: boolean;
  /**
   * Whether the hours unit should be padded with zeroes to a length of 2.
   *
   * @example `1:20:03 -> 01:20:03`
   */
  padHours: boolean;
  /**
   * Whether to display the remaining time from the current type, until the duration is reached.
   *
   * @example `duration` - `currentTime`
   */
  remainder: boolean;
}

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/time}
 * @example
 * ```html
 * <vds-time type="current"></vds-time>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <vds-time type="current" remainder></vds-time>
 * ```
 */
export interface TimeElement extends HTMLCustomElement<TimeProps> {}
