import { VdsUserPauseEvent, VdsUserPlayEvent } from '../../../core';
import { TOGGLE_CONTROL_STORYBOOK_ARG_TYPES } from '../toggle-control';
import {
  PlaybackToggleActions,
  PlaybackToggleFakeProps,
  PlaybackToggleProps,
} from './playback-toggle.types';

export type PlaybackToggleStorybookArgs = {
  [P in keyof (PlaybackToggleProps &
    PlaybackToggleFakeProps &
    PlaybackToggleActions)]: unknown;
};

export const PLAYBACK_TOGGLE_STORYBOOK_ARG_TYPES: PlaybackToggleStorybookArgs = {
  ...TOGGLE_CONTROL_STORYBOOK_ARG_TYPES,
  fakePaused: {
    control: 'boolean',
    defaultValue: true,
  },
  onUserPlay: {
    action: VdsUserPlayEvent.TYPE,
  },
  onUserPause: {
    action: VdsUserPauseEvent.TYPE,
  },
};
