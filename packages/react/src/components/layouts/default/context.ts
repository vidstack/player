import * as React from 'react';

import type { DefaultLayoutTranslations, ThumbnailSrc } from 'vidstack';

import type { DefaultLayoutIcons } from './icons';

export const DefaultLayoutContext = React.createContext<DefaultLayoutContext>({} as any);

interface DefaultLayoutContext {
  thumbnails: ThumbnailSrc;
  menuContainer?: React.RefObject<HTMLElement | null>;
  translations?: DefaultLayoutTranslations | null;
  isSmallLayout: boolean;
  showMenuDelay?: number;
  showTooltipDelay: number;
  hideQualityBitrate: boolean;
  menuGroup: 'top' | 'bottom';
  noModal: boolean;
  Icons: DefaultLayoutIcons;
  slots?: unknown;
  sliderChaptersMinWidth: number;
  disableTimeSlider: boolean;
  noGestures: boolean;
  noKeyboardActionDisplay: boolean;
}

export function useDefaultLayoutLang(word: keyof DefaultLayoutTranslations) {
  const { translations } = React.useContext(DefaultLayoutContext);
  return i18n(translations, word);
}

export function i18n(translations: any, word: string) {
  return translations?.[word] ?? word;
}
