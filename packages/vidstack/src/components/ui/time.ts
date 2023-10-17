import { Component, effect, State } from 'maverick.js';
import { isNull } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { formatTime } from '../../utils/time';

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @attr data-type - The type prop setting (current, duration, etc.).
 * @attr data-remainder - Whether time remaining is being shown.
 * @docs {@link https://www.vidstack.io/docs/player/components/display/time}
 */
export class Time extends Component<TimeProps, TimeState> {
  static props: TimeProps = {
    type: 'current',
    showHours: false,
    padHours: null,
    padMinutes: null,
    remainder: false,
  };

  static state = new State<TimeState>({
    timeText: '',
  });

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._watchTime();

    const { type, remainder } = this.$props;
    this.setAttributes({
      'data-type': type,
      'data-remainder': remainder,
    });
  }

  protected override onAttach(el: HTMLElement) {
    effect(this._watchTime.bind(this));
  }

  private _watchTime() {
    const { type, remainder, padHours, padMinutes, showHours } = this.$props,
      seconds = this._getSeconds(type()),
      duration = this._media.$state.duration();

    if (!Number.isFinite(seconds + duration)) {
      this.$state.timeText.set('LIVE');
      return;
    }

    const time = remainder() ? Math.max(0, duration - seconds) : seconds,
      formattedTime = formatTime(time, padHours(), padMinutes(), showHours());

    this.$state.timeText.set(formattedTime);
  }

  private _getSeconds(type: TimeProps['type']) {
    const { bufferedEnd, duration, currentTime } = this._media.$state;
    switch (type) {
      case 'buffered':
        return bufferedEnd();
      case 'duration':
        return duration();
      default:
        return currentTime();
    }
  }
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
  padHours: boolean | null;
  /**
   * Whether the minutes unit should be padded with zeroes to a length of 2.
   *
   * @example `5:22 -> 05:22`
   */
  padMinutes: boolean | null;
  /**
   * Whether to display the remaining time from the current type, until the duration is reached.
   *
   * @example `duration` - `currentTime`
   */
  remainder: boolean;
}

export interface TimeState {
  timeText: string;
}
