import { Component, effect, onDispose, signal, State } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { IntersectionObserverController } from '../../foundation/observers/intersection-observer';
import { observeVisibility, onPress } from '../../utils/dom';
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
    toggle: false,
    hidden: false,
  };

  static state = new State<TimeState>({
    timeText: '',
    hidden: false,
  });

  private _media!: MediaContext;
  private _invert = signal<boolean | null>(null);
  private _isVisible = signal(true);
  private _isIntersecting = signal(true);

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._watchTime();

    const { type } = this.$props;
    this.setAttributes({
      'data-type': type,
      'data-remainder': this._shouldInvert.bind(this),
    });

    new IntersectionObserverController({
      callback: this._onIntersectionChange.bind(this),
    }).attach(this);
  }

  protected override onAttach(el: HTMLElement) {
    if (!el.hasAttribute('role')) effect(this._watchRole.bind(this));
    effect(this._watchTime.bind(this));
  }

  protected override onConnect(el: HTMLElement): void {
    onDispose(observeVisibility(el, this._isVisible.set));

    effect(this._watchHidden.bind(this));
    effect(this._watchToggle.bind(this));
  }

  private _onIntersectionChange(entries: IntersectionObserverEntry[]) {
    this._isIntersecting.set(entries[0].isIntersecting);
  }

  private _watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this._isVisible() || !this._isIntersecting());
  }

  private _watchToggle() {
    if (!this.$props.toggle()) {
      this._invert.set(null);
      return;
    }

    if (this.el) {
      onPress(this.el, this._onToggle.bind(this));
    }
  }

  private _watchTime() {
    const { hidden, timeText } = this.$state,
      { duration } = this._media.$state;

    if (hidden()) return;

    const { type, padHours, padMinutes, showHours } = this.$props,
      seconds = this._getSeconds(type()),
      $duration = duration(),
      shouldInvert = this._shouldInvert();

    if (!Number.isFinite(seconds + $duration)) {
      timeText.set('LIVE');
      return;
    }

    const time = shouldInvert ? Math.max(0, $duration - seconds) : seconds,
      formattedTime = formatTime(time, {
        padHrs: padHours(),
        padMins: padMinutes(),
        showHrs: showHours(),
      });

    timeText.set((shouldInvert ? '-' : '') + formattedTime);
  }

  private _watchRole() {
    if (!this.el) return;
    const { toggle } = this.$props;
    setAttribute(this.el, 'role', toggle() ? 'timer' : null);
    setAttribute(this.el, 'tabindex', toggle() ? 0 : null);
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

  private _shouldInvert() {
    return this.$props.remainder() && this._invert() !== false;
  }

  private _onToggle(event: Event) {
    event.preventDefault();

    if (this._invert() === null) {
      this._invert.set(!this.$props.remainder());
      return;
    }

    this._invert.set((v) => !v);
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
  /**
   * Whether on press the time should invert showing the remaining time (i.e., toggle the
   * `remainder` prop).
   */
  toggle: boolean;
  /**
   * Provides a hint that the time is not visible and stops all events and updates to be more
   * power efficient.
   */
  hidden: boolean;
}

export interface TimeState {
  timeText: string;
  hidden: boolean;
}
