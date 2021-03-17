import { VdsUserSeeked, VdsUserSeeking } from '../../../core';
import { SLIDER_STORYBOOK_ARG_TYPES } from '../slider';
import {
  ScrubberActions,
  ScrubberFakeProps,
  ScrubberProps,
} from './scrubber.types';

export type ScrubberStorybookArgs = {
  [P in keyof (ScrubberProps & ScrubberFakeProps & ScrubberActions)]: unknown;
} & {
  // Only so we can remove from arg types.
  label?: undefined;
  min?: undefined;
  max?: undefined;
  value?: undefined;
  valueText?: undefined;
};

export const SCRUBBER_STORYBOOK_ARG_TYPES: Partial<ScrubberStorybookArgs> = {
  ...SLIDER_STORYBOOK_ARG_TYPES,
  label: undefined,
  min: undefined,
  max: undefined,
  value: undefined,
  valueText: undefined,
  step: {
    control: 'number',
    defaultValue: 1,
  },
  stepMultiplier: {
    control: 'number',
    defaultValue: 10,
  },
  sliderLabel: {
    control: 'text',
    defaultValue: 'Time scrubber',
  },
  progressLabel: {
    control: 'text',
    defaultValue: 'Amount buffered',
  },
  progressText: {
    control: 'text',
    defaultValue: '{currentTime} out of {duration}',
  },
  hidden: {
    control: 'boolean',
    defaultValue: false,
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  fakeCurrentTime: {
    control: 'number',
    defaultValue: 1000,
  },
  fakeDuration: {
    control: 'number',
    defaultValue: 3600,
  },
  fakeBuffered: {
    control: 'number',
    defaultValue: 1350,
  },
  onUserSeeked: {
    action: VdsUserSeeked.TYPE,
  },
  onUserSeeking: {
    action: VdsUserSeeking.TYPE,
  },
};
