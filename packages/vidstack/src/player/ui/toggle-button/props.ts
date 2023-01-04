import type { CustomElementPropDefinitions } from 'maverick.js/element';

import type { ToggleButtonProps } from './types';

export const toggleButtonProps: CustomElementPropDefinitions<ToggleButtonProps> = {
  disabled: { initial: false },
};
