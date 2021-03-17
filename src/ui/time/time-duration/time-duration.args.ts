import { TIME_STORYBOOK_ARG_TYPES } from '../time';
import {
  TimeDurationFakeProps,
  TimeDurationProps,
} from './time-duration.types';

export type TimeDurationStorybookArgs = {
  [P in keyof (TimeDurationProps & TimeDurationFakeProps)]: unknown;
} & {
  duration: undefined;
};

export const TIME_DURATION_STORYBOOK_ARG_TYPES: TimeDurationStorybookArgs = {
  ...TIME_STORYBOOK_ARG_TYPES,
  duration: undefined,
  fakeDuration: {
    control: 'number',
    defaultValue: 3750,
  },
};
