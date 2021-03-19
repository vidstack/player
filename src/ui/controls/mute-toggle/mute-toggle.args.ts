import { VdsUserMutedChangeEvent } from '../../../core';
import { TOGGLE_CONTROL_STORYBOOK_ARG_TYPES } from '../toggle-control';
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
  ...TOGGLE_CONTROL_STORYBOOK_ARG_TYPES,
  fakeMuted: {
    control: 'boolean',
    defaultValue: false,
  },
  onUserMutedChange: {
    action: VdsUserMutedChangeEvent.TYPE,
  },
};
