import { createContext, type ReadSignal } from 'maverick.js';

export interface TooltipContext {
  trigger: ReadSignal<HTMLElement | null>;
  content: ReadSignal<HTMLElement | null>;
  showing: ReadSignal<boolean>;
  attachTrigger(el: HTMLElement): void;
  detachTrigger(el: HTMLElement): void;
  attachContent(el: HTMLElement): void;
  detachContent(el: HTMLElement): void;
}

export const tooltipContext = createContext<TooltipContext>();
