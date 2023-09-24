import * as React from 'react';

import type { DefaultLayoutTranslations } from 'vidstack/local';

import type { DefaultLayoutIcons } from './icons';

export const DefaultLayoutContext = React.createContext<DefaultLayoutContext>({} as any);

interface DefaultLayoutContext {
  thumbnails?: string;
  menuContainer?: React.RefObject<HTMLElement | null>;
  translations?: DefaultLayoutTranslations | null;
  isSmallLayout: boolean;
  showMenuDelay?: number;
  showTooltipDelay?: number;
  menuGroup: 'top' | 'bottom';
  noPopupMenu: boolean;
  Icons: DefaultLayoutIcons;
}

export function useDefaultLayoutLang(word: keyof DefaultLayoutTranslations) {
  const { translations } = React.useContext(DefaultLayoutContext);
  return translations?.[word] ?? word;
}
