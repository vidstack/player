import type { HTMLCustomElement } from 'maverick.js/element';

import type { SliderCSSVars } from './cssvars';
import type { SliderEvents } from './events';
import type { SliderProps } from './props';
import type { SliderStore } from './store';

export { SliderProps, SliderEvents, SliderCSSVars };

export interface SliderMembers
  extends SliderProps,
    Readonly<
      Pick<
        SliderStore,
        | 'pointing'
        | 'dragging'
        | 'interactive'
        | 'pointerValue'
        | 'fillRate'
        | 'fillPercent'
        | 'pointerRate'
        | 'pointerPercent'
      >
    > {}

export interface SliderElement
  extends HTMLCustomElement<SliderProps, SliderEvents, SliderCSSVars>,
    SliderMembers {}
