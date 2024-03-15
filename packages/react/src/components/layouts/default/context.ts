import * as React from 'react';

import type { WriteSignal } from 'maverick.js';

import type { DefaultLayoutProps } from './media-layout';

export const DefaultLayoutContext = React.createContext<DefaultLayoutContext>({} as any);
DefaultLayoutContext.displayName = 'DefaultLayoutContext';

interface DefaultLayoutContext extends DefaultLayoutProps {
  menuContainer?: React.RefObject<HTMLElement | null>;
  isSmallLayout: boolean;
  userPrefersAnnouncements: WriteSignal<boolean>;
  userPrefersKeyboardAnimations: WriteSignal<boolean>;
}

export function useDefaultLayoutContext() {
  return React.useContext(DefaultLayoutContext);
}

export function useDefaultLayoutWord(word: string) {
  const { translations } = useDefaultLayoutContext();
  return i18n(translations, word);
}

export function i18n(translations: any, word: string) {
  return translations?.[word] ?? word;
}
