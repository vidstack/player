import { TIME_STORYBOOK_ARG_TYPES, TimeProps } from '../time';

export type TimeDurationProps = Omit<TimeProps, 'duration'>;

export interface TimeDurationFakeProps {
  fakeDuration: number;
}

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
