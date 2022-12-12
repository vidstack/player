import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { mediaProviderProps } from '../../media/provider/props';
import type { HTMLProviderProps } from './types';

export const htmlProviderProps: CustomElementPropDefinitions<HTMLProviderProps> = {
  ...mediaProviderProps,
  preload: { initial: 'metadata' },
};
