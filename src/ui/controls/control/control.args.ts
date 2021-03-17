import { ControlProps } from './control.types';

export type ControlStorybookArgs = {
  [P in keyof ControlProps]: unknown;
};

export const CONTROL_STORYBOOK_ARG_TYPES: ControlStorybookArgs = {
  label: {
    control: 'text',
  },
  describedBy: {
    control: 'text',
  },
  controls: {
    control: 'text',
  },
  hasPopup: {
    control: 'boolean',
    defaultValue: false,
  },
  hidden: {
    control: 'boolean',
    defaultValue: false,
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  type: {
    control: {
      type: 'select',
      options: ['button', 'submit', 'reset', 'menu'],
    },
    defaultValue: 'button',
  },
  expanded: {
    control: 'boolean',
    defaultValue: false,
  },
  pressed: {
    control: 'boolean',
    defaultValue: false,
  },
};
