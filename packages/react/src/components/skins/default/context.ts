import * as React from 'react';
import type { DefaultSkinTranslations } from 'vidstack/local';
import type { DefaultIcons } from './icons';

export const DefaultUIContext = React.createContext<DefaultUIContext>({} as any);

interface DefaultUIContext {
  thumbnails?: string;
  menuContainer?: React.RefObject<HTMLElement | null>;
  translations?: DefaultSkinTranslations | null;
  isSmallLayout: boolean;
  showMenuDelay?: number;
  showTooltipDelay?: number;
  Icons: DefaultIcons;
}

export function useI18N(word: keyof DefaultSkinTranslations) {
  const { translations } = React.useContext(DefaultUIContext);
  return translations?.[word] ?? word;
}
