import { createContext, type ReadSignal, type WriteSignal } from 'maverick.js';

import type { SliderOrientation } from './types';

export interface SliderContext {
  disabled: ReadSignal<boolean>;
  orientation: ReadSignal<SliderOrientation>;
  preview: WriteSignal<HTMLElement | null>;
}

export const sliderContext = createContext<SliderContext>();

export interface SliderObserverContext {
  onDragStart?(): void;
  onDragEnd?(): void;
}

export const sliderObserverContext = createContext<SliderObserverContext>();
