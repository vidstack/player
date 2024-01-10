import * as React from 'react';

import type { DefaultLayoutTranslations, ThumbnailSrc } from 'vidstack';

import type { DefaultLayoutIcons } from './icons';

export const DefaultLayoutContext = React.createContext<DefaultLayoutContext>({} as any);

interface DefaultLayoutContext {
  disableTimeSlider: boolean;
  hideQualityBitrate: boolean;
  Icons: DefaultLayoutIcons;
  isSmallLayout: boolean;
  menuContainer?: React.RefObject<HTMLElement | null>;
  menuGroup: 'top' | 'bottom';
  noGestures: boolean;
  noKeyboardActionDisplay: boolean;
  noModal: boolean;
  showMenuDelay?: number;
  showTooltipDelay: number;
  sliderChaptersMinWidth: number;
  slots?: unknown;
  thumbnails: ThumbnailSrc;
  translations?: DefaultLayoutTranslations | null;
}

export function useDefaultLayoutLang(word: string) {
  const { translations } = React.useContext(DefaultLayoutContext);
  return i18n(translations, word);
}

export function i18n(translations: any, word: string) {
  return translations?.[word] ?? word;
}
