import { SLIDER_STORYBOOK_ARG_TYPES, SliderProps } from '../slider';

export interface ScrubberProps
  extends Omit<SliderProps, 'label' | 'min' | 'max' | 'value' | 'valueText'> {
  /**
   * ♿ **ARIA:** The `aria-label` for the slider.
   */
  sliderLabel: string;

  /**
   * ♿ **ARIA:** The `aria-label` for the buffered progress bar.
   */
  progressLabel: string;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current scrubber progress. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `20 minutes out of 1 hour, 20 minutes. `
   */
  progressText: string;

  /**
   * Whether the scrubber is hidden.
   */
  hidden: boolean;

  /**
   * Whether the scubber is disabled.
   */
  disabled: boolean;
}

export interface ScrubberFakeProps {
  fakeCurrentTime: number;
  fakeDuration: number;
  fakeBuffered: number;
}

export type ScrubberStorybookArgs = {
  [P in keyof (ScrubberProps & ScrubberFakeProps)]: unknown;
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
};
