import { TIME_STORYBOOK_ARG_TYPES, TimeProps } from '../time';

export type TimeCurrentProps = Omit<TimeProps, 'duration'>;

export interface TimeCurrentFakeProps {
  fakeCurrentTime: number;
}

export type TimeCurrentStorybookArgs = {
  [P in keyof (TimeCurrentProps & TimeCurrentFakeProps)]: unknown;
} & {
  duration: undefined;
};

export const TIME_CURRENT_STORYBOOK_ARG_TYPES: TimeCurrentStorybookArgs = {
  ...TIME_STORYBOOK_ARG_TYPES,
  duration: undefined,
  fakeCurrentTime: {
    control: 'number',
    defaultValue: 3750,
  },
};
