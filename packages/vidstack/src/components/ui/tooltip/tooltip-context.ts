import { createContext, type ReadSignal } from 'maverick.js';

export interface TooltipContext {
  _trigger: ReadSignal<HTMLElement | null>;
  _content: ReadSignal<HTMLElement | null>;
  _attachTrigger(el: HTMLElement): void;
  _detachTrigger(el: HTMLElement): void;
  _attachContent(el: HTMLElement): void;
  _detachContent(el: HTMLElement): void;
}

export const tooltipContext = createContext<TooltipContext>();
