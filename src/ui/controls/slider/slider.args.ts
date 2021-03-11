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
   * The lowest value in the range of permitted values.
   */
  min: number;

  /**
   * The greatest value in the range of permitted values.
   */
  max: number;

  /**
   * The current value.
   */
  value: number;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  valueText?: string;

  /**
   * A number that specifies the granularity that the value must adhere to.
   */
  step: number;

  /**
   * A number determining how much the value should increase/decrease by Shift+Arrow keys,
   * which will be `(max - min) / stepRatio`.
   */
  stepRatio: number;

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
   * The amount of milliseconds to throttle slider thumb during `mousemove` / `touchmove` events.
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
  stepRatio: {
    control: 'number',
    defaultValue: 4,
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
