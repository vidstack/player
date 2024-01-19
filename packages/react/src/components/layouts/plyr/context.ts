import * as React from 'react';

import { type WriteSignal } from 'maverick.js';
import type { PlyrLayoutWord } from 'vidstack';

import type { PlyrLayoutProps } from './props';

interface PlyrLayoutContext extends PlyrLayoutProps {
  previewTime: WriteSignal<number>;
}

export const PlyrLayoutContext = React.createContext<PlyrLayoutContext>({} as any);
PlyrLayoutContext.displayName = 'PlyrLayoutContext';

export function usePlyrLayoutContext() {
  return React.useContext(PlyrLayoutContext);
}

export function usePlyrLayoutWord(word: PlyrLayoutWord) {
  const { translations } = usePlyrLayoutContext();
  return i18n(translations, word);
}

export function i18n(translations: any, word: string) {
  return translations?.[word] ?? word;
}
