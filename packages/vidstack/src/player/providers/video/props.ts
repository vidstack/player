import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { htmlProviderProps } from '../html/props';
import type { VideoProviderProps } from './types';

export const videoProviderProps: CustomElementPropDefinitions<VideoProviderProps> =
  htmlProviderProps;
