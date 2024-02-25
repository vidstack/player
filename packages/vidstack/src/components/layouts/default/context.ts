import { createContext, useContext, type ReadSignalRecord, type WriteSignal } from 'maverick.js';

import type { DefaultLayoutProps } from './props';

export interface DefaultLayoutContext extends ReadSignalRecord<DefaultLayoutProps> {
  menuContainer: HTMLElement | null;
  userPrefersKeyboardAnimations: WriteSignal<boolean>;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
