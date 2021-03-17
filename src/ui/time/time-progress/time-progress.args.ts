import { TIME_STORYBOOK_ARG_TYPES } from '../time/time.args';
import {
  TimeProgressFakeProps,
  TimeProgressProps,
} from './time-progress.types';

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
