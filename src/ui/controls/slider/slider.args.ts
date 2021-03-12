import { Callback } from '../../../shared/types';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent,
} from './slider.events';

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

export type SliderStorybookArgs = {
  [P in keyof SliderProps & SliderActions]: unknown;
};

export const SLIDER_STORYBOOK_ARG_TYPES: SliderStorybookArgs = {
  label: {
    control: 'text',
  },
  min: {
    control: 'number',
    defaultValue: 0,
  },
  max: {
    control: 'number',
    defaultValue: 100,
  },
  step: {
    control: 'number',
    defaultValue: 1,
  },
  stepMultiplier: {
    control: 'number',
    defaultValue: 10,
  },
  value: {
    control: 'number',
    defaultValue: 50,
  },
  valueText: {
    control: 'text',
  },
  orientation: {
    control: {
      type: 'select',
      options: ['horizontal', 'vertical'],
    },
    defaultValue: 'horizontal',
  },
  throttle: {
    control: 'number',
    defaultValue: 10,
  },
  hidden: {
    control: 'boolean',
    defaultValue: false,
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  onValueChange: {
    action: SliderValueChangeEvent.TYPE,
  },
  onDragStart: {
    action: SliderDragStartEvent.TYPE,
  },
  onDragEnd: {
    action: SliderDragEndEvent.TYPE,
  },
};
