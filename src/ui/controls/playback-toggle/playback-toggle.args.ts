import {
  PlaybackToggleFakeProps,
  PlaybackToggleProps,
} from './playback-toggle.types';

export type PlaybackToggleStorybookArgs = {
  [P in keyof (PlaybackToggleProps & PlaybackToggleFakeProps)]: unknown;
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
};
