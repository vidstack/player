import { ToggleControlProps } from './toggle-control.types';

export type ToggleControlStorybookArgs = {
  [P in keyof ToggleControlProps]: unknown;
};

export const TOGGLE_CONTROL_STORYBOOK_ARG_TYPES: ToggleControlStorybookArgs = {
  describedBy: {
    control: 'text',
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  label: {
    control: 'text',
  },
};
