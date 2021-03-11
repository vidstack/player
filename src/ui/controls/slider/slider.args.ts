import { Callback } from '../../../shared/types';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent,
} from './slider.events';

export const SLIDER_ARG_TYPES = {
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

export interface SliderArgTypes {
  min: number;
  max: number;
  value: number;
  valueText: string;
  label: string;
  step: number;
  stepRatio: number;
  hidden: boolean;
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
  throttle: number;
  onValueChange: Callback<CustomEvent>;
  onDragStart: Callback<CustomEvent>;
  onDragEnd: Callback<CustomEvent>;
}
