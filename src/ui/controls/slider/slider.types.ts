import { Callback } from '../../../shared/types';

/**
 * The direction to move the thumb, associated with key symbols.
 */
export enum SliderKeyDirection {
  Left = -1,
  ArrowLeft = -1,
  Up = -1,
  ArrowUp = -1,
  Right = 1,
  ArrowRight = 1,
  Down = 1,
  ArrowDown = 1,
}

export interface SliderProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the slider.
   */
  label?: string;

  /**
   * The lowest slider value in the range of permitted values.
   */
  min: number;

  /**
   * The greatest slider value in the range of permitted values.
   */
  max: number;

  /**
   * The current slider value.
   */
  value: number;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  valueText?: string;

  /**
   * A number that specifies the granularity that the slider value must adhere to.
   */
  step: number;

  /**
   * A number that will be used to multiply the `step` when the `Shift` key is held down and the
   * slider value is changed by pressing `LeftArrow` or `RightArrow`.
   */
  stepMultiplier: number;

  /**
   * Whether the slider should be hidden.
   */
  hidden: boolean;

  /**
   * Whether the slider should be disabled (not-interactable).
   */
  disabled: boolean;

  /**
   * ♿ **ARIA:** Indicates the orientation of the slider.
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove`
   * events.
   */
  throttle: number;
}

export interface SliderActions {
  onValueChange: Callback<CustomEvent>;
  onDragStart: Callback<CustomEvent>;
  onDragEnd: Callback<CustomEvent>;
}
