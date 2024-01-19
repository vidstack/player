import { createContext, useContext, type ReadSignalRecord, type WriteSignal } from 'maverick.js';

import type { PlyrLayoutProps } from './props';

export interface PlyrLayoutContext extends ReadSignalRecord<PlyrLayoutProps> {
  previewTime: WriteSignal<number>;
}

export const plyrLayoutContext = createContext<PlyrLayoutContext>();

export function usePlyrLayoutContext() {
  return useContext(plyrLayoutContext);
}
