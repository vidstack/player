import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { TimeProps } from './types';

export const timeProps: CustomElementPropDefinitions<TimeProps> = {
  type: { initial: 'current' },
  showHours: { initial: false },
  padHours: { initial: false },
  padMinutes: { initial: false },
  remainder: { initial: false },
};
