import { createContext, useContext, type ReadSignalRecord } from 'maverick.js';

import type { DefaultLayoutProps } from './props';

export interface DefaultLayoutContext extends ReadSignalRecord<DefaultLayoutProps> {
  menuContainer: HTMLElement | null;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
