import {
  VdsSliderDragEndEvent,
  VdsSliderDragStartEvent,
  VdsSliderValueChangeEvent,
} from './slider.events';
import { SliderActions, SliderProps } from './slider.types';

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
    action: VdsSliderValueChangeEvent.TYPE,
  },
  onDragStart: {
    action: VdsSliderDragStartEvent.TYPE,
  },
  onDragEnd: {
    action: VdsSliderDragEndEvent.TYPE,
  },
};
