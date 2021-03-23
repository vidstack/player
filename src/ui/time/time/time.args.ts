import { TimeProps } from './time.types';

export type TimeStorybookArgs = {
  [P in keyof TimeProps]: unknown;
};

export const TIME_STORYBOOK_ARG_TYPES: TimeStorybookArgs = {
  label: {
    control: 'text',
    defaultValue: '',
  },
  seconds: {
    control: 'number',
    defaultValue: 3750,
  },
  alwaysShowHours: {
    control: 'boolean',
    defaultValue: false,
  },
  padHours: {
    control: 'boolean',
    defaultValue: false,
  },
};
