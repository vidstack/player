import { Callback } from '../../../shared/types';

export const SLIDER_ARG_TYPES = {
  min: {
    control: 'number',
    defaultValue: 0,
  },
  max: {
    control: 'number',
    defaultValue: 100,
  },
  value: {
    control: 'number',
    defaultValue: 50,
  },
  onValueChange: {
    action: 'value change',
  },
  onDragStart: {
    action: 'drag start',
  },
  onDragEnd: {
    action: 'drag end',
  },
};

export interface SliderArgTypes {
  min: number;
  max: number;
  value: number;
  onValueChange: Callback<CustomEvent>;
  onDragStart: Callback<CustomEvent>;
  onDragEnd: Callback<CustomEvent>;
}
