import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { HTMLProviderProps } from './types';

export const htmlProviderProps: CustomElementPropDefinitions<HTMLProviderProps> = {
  preload: { initial: 'metadata' },
};
