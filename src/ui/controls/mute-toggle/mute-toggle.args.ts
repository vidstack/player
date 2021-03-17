import { MuteToggleFakeProps, MuteToggleProps } from './mute-toggle.types';

export type MuteToggleStorybookArgs = {
  [P in keyof (MuteToggleProps & MuteToggleFakeProps)]: unknown;
};

export const MUTE_TOGGLE_STORYBOOK_ARG_TYPES: MuteToggleStorybookArgs = {
  label: {
    control: 'text',
  },
  describedBy: {
    control: 'text',
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  fakeMuted: {
    control: 'boolean',
    defaultValue: false,
  },
};
