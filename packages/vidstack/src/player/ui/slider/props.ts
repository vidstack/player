import type { CustomElementPropDefinitions } from 'maverick.js/element';

export const sliderProps: CustomElementPropDefinitions<SliderProps> = {
  min: { initial: 0 },
  max: { initial: 100 },
  disabled: { initial: false, type: { from: false } },
  value: { initial: 100 },
  step: { initial: 1 },
  keyStep: { initial: 1 },
  shiftKeyMultiplier: { initial: 5 },
};

export interface SliderProps {
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
