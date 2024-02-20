import { createContext } from 'maverick.js';

import type { FormatTimeOptions } from '../../../../utils/time';

export const sliderValueFormatContext = createContext<SliderValueFormat>(() => ({}));

export interface SliderValueFormat {
  default?: 'value' | 'percent' | 'time';
  value?(value: number): string;
  percent?(percent: number, decimalPlaces: number): string;
  time?(value: number, options?: FormatTimeOptions): string;
}
