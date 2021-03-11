import { TimeProps } from '../time';
import { TIME_STORYBOOK_ARG_TYPES } from '../time/time.args';

export type TimeProgressProps = Omit<TimeProps, 'duration'> & {
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

export type TimeProgressStorybookArgs = {
  [P in keyof (TimeProgressProps & TimeProgressFakeProps)]: unknown;
} & {
  duration: undefined;
};

export const TIME_PROGRESS_STORYBOOK_ARG_TYPES: TimeProgressStorybookArgs = {
  ...TIME_STORYBOOK_ARG_TYPES,
  duration: undefined,
  currentTimeLabel: {
    control: 'text',
    defaultValue: 'Current time',
  },
  durationLabel: {
    control: 'text',
    defaultValue: 'Duration',
  },
  timeSeparator: {
    control: 'text',
    defaultValue: '/',
  },
  fakeCurrentTime: {
    control: 'number',
    defaultValue: 3750,
  },
  fakeDuration: {
    control: 'number',
    defaultValue: 7500,
  },
};
