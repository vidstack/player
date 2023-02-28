import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { SliderValueProps } from './types';

export const sliderValueTextProps: CustomElementPropDefinitions<SliderValueProps> = {
  type: { initial: 'current' },
  format: {},
  showHours: { initial: false },
  padHours: { initial: false },
  decimalPlaces: { initial: 2 },
};
