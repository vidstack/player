import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { SliderValueTextProps } from './types';

export const sliderValueTextProps: CustomElementPropDefinitions<SliderValueTextProps> = {
  type: { initial: 'current' },
  format: {},
  showHours: { initial: false },
  padHours: { initial: false },
  decimalPlaces: { initial: 2 },
};
