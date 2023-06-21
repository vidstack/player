import { createContext, type ReadSignal, type WriteSignal } from 'maverick.js';

import type { SliderOrientation } from './types';

export interface SliderContext {
  _disabled: ReadSignal<boolean>;
  _orientation: ReadSignal<SliderOrientation>;
  _preview: WriteSignal<HTMLElement | null>;
}

export const sliderContext = createContext<SliderContext>();
