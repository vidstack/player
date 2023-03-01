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
   */
  step: number;
  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   */
  keyStep: number;
  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyStep * shiftKeyMultiplier`.
   */
  shiftKeyMultiplier: number;
}
