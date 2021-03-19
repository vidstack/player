import { VdsUserSeekedEvent, VdsUserSeekingEvent } from '../../../core';
import { SLIDER_STORYBOOK_ARG_TYPES } from '../slider';
import {
  VdsScrubberPreviewHideEvent,
  VdsScrubberPreviewShowEvent,
  VdsScrubberPreviewTimeUpdate,
} from './scrubber.events';
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
  fakeSeekableAmount: {
    control: 'number',
    defaultValue: 1800,
  },
  onUserSeeked: {
    action: VdsUserSeekedEvent.TYPE,
  },
  onUserSeeking: {
    action: VdsUserSeekingEvent.TYPE,
  },
  onPreviewShow: {
    action: VdsScrubberPreviewShowEvent.TYPE,
  },
  onPreviewHide: {
    action: VdsScrubberPreviewHideEvent.TYPE,
  },
  onPreviewTimeUpdate: {
    action: VdsScrubberPreviewTimeUpdate.TYPE,
  },
};
