import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { htmlProviderProps } from '../html/props';
import type { AudioProviderProps } from './types';

export const audioProviderProps: CustomElementPropDefinitions<AudioProviderProps> =
  htmlProviderProps;
