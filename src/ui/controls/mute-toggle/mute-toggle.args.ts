import { VdsUserMutedChangeEvent } from '../../../core';
import {
  MuteToggleActions,
  MuteToggleFakeProps,
  MuteToggleProps,
} from './mute-toggle.types';

export type MuteToggleStorybookArgs = {
  [P in keyof (MuteToggleProps &
    MuteToggleFakeProps &
    MuteToggleActions)]: unknown;
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
  onUserMutedChange: {
    action: VdsUserMutedChangeEvent.TYPE,
  },
};
