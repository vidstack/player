import type { PropDeclarations } from 'maverick.js/element';

export const sliderProps: PropDeclarations<SliderProps> = {
  min: 0,
  max: 100,
  disabled: false,
  value: 100,
  step: 1,
  keyStep: 1,
  shiftKeyMultiplier: 5,
  trackClass: null,
  trackFillClass: null,
  trackProgressClass: null,
  thumbContainerClass: null,
  thumbClass: null,
};

export interface SliderProps {
  // Classes
  trackClass: string | null;
  trackFillClass: string | null;
  trackProgressClass: string | null;
  thumbContainerClass: string | null;
  thumbClass: string | null;

  /**
   * The lowest slider value in the range of permitted values.
   */
  min: number;
  /**
   * The greatest slider value in the range of permitted values.
   */
  max: number;
  /**
   * Whether the slider should be disabled (non-interactive).
   */
  disabled: boolean;
  /**
   * The current slider value.
   */
  value: number;
  /**
   * A number that specifies the granularity that the slider value must adhere to.
   *
   * A step is an abstract unit that may carry a different type of measure depending on the type of
   * slider. For example, for the volume slider each step is 1% of volume, and for the time slider
   * it is 1 second which is a varying percentage depending on the media duration.
   */
  step: number;
  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   *
   * A step is an abstract unit that may carry different type of measure depending on the type of
   * slider. For example, for the volume slider each step is 1% of volume, and for the time slider
   * it is 1 second which is a varying percentage depending on the media duration.
   */
  keyStep: number;
  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyStep * shiftKeyMultiplier`.
   */
  shiftKeyMultiplier: number;
}
