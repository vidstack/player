import { VdsUserPauseEvent, VdsUserPlayEvent } from '../../../core';
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
