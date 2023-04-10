import { createContext } from 'maverick.js';

export const sliderValueFormattersContext = createContext<SliderValueFormatters>(() => ({}));

interface SliderValueFormatters {
  value?(value: number): string;
  percent?(percent: number, decimalPlaces: number): string;
  time?(value: number, padHours: boolean, padMinutes: boolean, showHours: boolean): string;
}
