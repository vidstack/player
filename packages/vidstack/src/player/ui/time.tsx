import { computed, type ReadSignal } from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { formatTime } from '../../utils/time';
import { useMedia, type MediaContext } from '../core/api/context';

declare global {
  interface MaverickElements {
    'media-time': MediaTimeElement;
  }
}

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/time}
 * @example
 * ```html
 * <media-time type="current"></media-time>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <media-time type="current" remainder></media-time>
 * ```
 */
export class Time extends Component<TimeAPI> {
  static el = defineElement<TimeAPI>({
    tagName: 'media-time',
    props: {
      type: 'current',
      showHours: false,
      padHours: false,
      padMinutes: false,
      remainder: false,
    },
  });

  protected _media!: MediaContext;
  protected _time!: ReadSignal<string>;

  protected override onAttach() {
    this._media = useMedia();
    this._time = computed(this._getTime.bind(this));
  }

  protected _getTime() {
    const { type, remainder, padHours, padMinutes, showHours } = this.$props,
      seconds = this._getSeconds(type()),
      duration = this._media.$store.duration();

    if (!Number.isFinite(seconds + duration)) return 'LIVE';

    const time = remainder() ? Math.max(0, duration - seconds) : seconds;
    return formatTime(time, padHours(), padMinutes(), showHours());
  }

  protected _getSeconds(type: TimeProps['type']) {
    const { bufferedEnd, duration, currentTime } = this._media.$store;
    switch (type) {
      case 'buffered':
        return bufferedEnd();
      case 'duration':
        return duration();
      default:
        return currentTime();
    }
  }

  override render() {
    return <span>{this._time()}</span>;
  }
}

export interface TimeAPI {
  props: TimeProps;
}

export interface TimeProps {
  /**
   * The type of media time to track.
   */
  type: 'current' | 'buffered' | 'duration';
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
   * Whether the minutes unit should be padded with zeroes to a length of 2.
   *
   * @example `5:22 -> 05:22`
   */
  padMinutes: boolean;
  /**
   * Whether to display the remaining time from the current type, until the duration is reached.
   *
   * @example `duration` - `currentTime`
   */
  remainder: boolean;
}

export interface MediaTimeElement extends HTMLCustomElement<Time> {}
