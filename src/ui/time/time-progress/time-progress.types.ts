import { TimeProps } from '../time';

export type TimeProgressProps = Omit<TimeProps, 'seconds'> & {
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
};

export interface TimeProgressFakeProps {
  fakeCurrentTime: number;
  fakeDuration: number;
}
