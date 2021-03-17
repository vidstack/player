import { SliderProps } from '../slider';

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
