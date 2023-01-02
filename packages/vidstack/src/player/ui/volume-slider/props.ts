import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { sliderProps } from '../slider/props';
import type { VolumeSliderProps } from './types';

export const volumeSliderProps: CustomElementPropDefinitions<VolumeSliderProps> = {
  ...sliderProps,
  min: { initial: 0, attribute: false },
  max: { initial: 100, attribute: false },
  value: { initial: 100, attribute: false },
};
