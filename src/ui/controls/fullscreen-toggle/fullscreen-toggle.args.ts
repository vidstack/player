import { VdsUserFullscreenChangeEvent } from '../../../core';
import { TOGGLE_CONTROL_STORYBOOK_ARG_TYPES } from '../toggle-control';
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
  ...TOGGLE_CONTROL_STORYBOOK_ARG_TYPES,
  fakeFullscreen: {
    control: 'boolean',
    defaultValue: false,
  },
  onUserFullscreenChange: {
    action: VdsUserFullscreenChangeEvent.TYPE,
  },
};
