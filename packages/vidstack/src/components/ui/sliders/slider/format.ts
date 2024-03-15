import { createContext } from 'maverick.js';

import type { FormatTimeOptions } from '../../../../utils/time';

export const sliderValueFormatContext = createContext<SliderValueFormat>(() => ({}));

export interface SliderValueFormat {
  default?: 'value' | 'percent' | 'time';
  value?(value: number): string | number;
  percent?(percent: number, decimalPlaces: number): string | number;
  time?(value: number, options?: FormatTimeOptions): string;
}
