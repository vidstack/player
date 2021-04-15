import { TimeElementProps } from '../time';
import { TimeCurrentElement } from '../time-current';
import { TimeDurationElement } from '../time-duration';

export const TIME_PROGRESS_ELEMENT_TAG_NAME = `time-progress`;

export type TimeProgressElementProps = Omit<
  TimeElementProps,
  'rootElement' | 'seconds'
> & {
  /**
   * ♿ **ARIA:** The `aria-label` property for the current time.
   */
  currentTimeLabel: string;

  /**
   * ♿ **ARIA:** The `aria-label` property for the duration.
   */
  durationLabel: string;

  /**
   * A string that is used to separate the current time and duration.
   */
  timeSeparator: string;

  /**
   * The component's root element.
   *
   * @default HTMLDivElement
   */
  readonly rootElement: HTMLDivElement;

  /**
   * The underlying `vds-time-current` component.
   *
   * @default TimeCurrent
   */
  readonly timeCurrent: TimeCurrentElement;

  /**
   * The underlying `vds-time-duration` component.
   *
   * @default TimeDuration
   */
  readonly timeDuration: TimeDurationElement;

  /**
   * The separator element.
   *
   * @default HTMLSpanElement
   */
  readonly separatorElement: HTMLSpanElement;
};
