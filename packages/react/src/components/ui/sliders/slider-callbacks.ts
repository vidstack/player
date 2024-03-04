import type { InferComponentEvents } from 'maverick.js';
import type { ReactEventCallbacks } from 'maverick.js/react';

import type { SliderInstance } from '../../primitives/instances';

type SliderCallbacks = keyof ReactEventCallbacks<InferComponentEvents<SliderInstance>>;

export const sliderCallbacks: SliderCallbacks[] = [
  'onDragStart',
  'onDragEnd',
  'onDragValueChange',
  'onValueChange',
  'onPointerValueChange',
];
