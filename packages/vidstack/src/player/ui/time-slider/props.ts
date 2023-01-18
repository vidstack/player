import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { sliderProps } from '../slider/props';
import type { TimeSliderProps } from './types';

export const timeSliderProps: CustomElementPropDefinitions<TimeSliderProps> = {
  ...sliderProps,
  step: { initial: 0.1 },
  min: { initial: 0, attribute: false },
  max: { initial: 0, attribute: false },
  value: { initial: 0, attribute: false },
  pauseWhileDragging: { initial: false },
  seekingRequestThrottle: { initial: 100 },
};
