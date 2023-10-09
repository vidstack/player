import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { SliderValueInstance } from '../../primitives/instances';

export const SliderValueBridge = createReactComponent(SliderValueInstance);

export interface SliderValueProps extends ReactElementProps<SliderValueInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}
