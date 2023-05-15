import { createContext } from 'maverick.js';

export interface TooltipContext {
  _attachTooltip(el: HTMLElement): void;
}

export const tooltipContext = createContext<TooltipContext>();
