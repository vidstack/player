import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { AspectRatioProps } from './types';

export const aspectRatioProps: CustomElementPropDefinitions<AspectRatioProps> = {
  minHeight: { initial: '150px' },
  maxHeight: { initial: '100vh' },
  ratio: { initial: '16/9' },
};
