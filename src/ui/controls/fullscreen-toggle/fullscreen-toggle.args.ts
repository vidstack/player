import { VdsUserFullscreenChangeEvent } from '../../../core';
import {
  FullscreenToggleActions,
  FullscreenToggleFakeProps,
  FullscreenToggleProps,
} from './fullscreen-toggle.types';

export type FullscreenToggleStorybookArgs = {
  [P in keyof (FullscreenToggleProps &
    FullscreenToggleFakeProps &
    FullscreenToggleActions)]: unknown;
};

export const FULLSCREEN_TOGGLE_STORYBOOK_ARG_TYPES: FullscreenToggleStorybookArgs = {
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
  fakeFullscreen: {
    control: 'boolean',
    defaultValue: false,
  },
  onUserFullscreenChange: {
    action: VdsUserFullscreenChangeEvent.TYPE,
  },
};
