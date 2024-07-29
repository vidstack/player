import { createContext, type ReadSignal } from 'maverick.js';

export interface RadioController {
  value: ReadSignal<string>;
  check(checked: boolean, trigger?: Event);
  onCheck: RadioChangeCallback | null;
}

export interface RadioChangeCallback {
  (value: string, trigger?: Event): void;
}

export interface RadioGroupContext {
  add(radio: RadioController): void;
  remove(radio: RadioController): void;
}

export const radioControllerContext = createContext<RadioGroupContext>();
