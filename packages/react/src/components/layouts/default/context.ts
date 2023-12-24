import * as React from 'react';

import type { DefaultLayoutTranslations } from 'vidstack';

import type { DefaultLayoutIcons } from './icons';

export const DefaultLayoutContext = React.createContext<DefaultLayoutContext>({} as any);

interface DefaultLayoutContext {
  thumbnails?: string;
  menuContainer?: React.RefObject<HTMLElement | null>;
  translations?: DefaultLayoutTranslations | null;
  isSmallLayout: boolean;
  showMenuDelay?: number;
  showTooltipDelay?: number;
  hideQualityBitrate?: boolean;
  menuGroup: 'top' | 'bottom';
  noModal: boolean;
  Icons: DefaultLayoutIcons;
  slots?: unknown;
  sliderChaptersMinWidth: number;
  disableTimeSlider: boolean;
  noGestures?: boolean;
}

export function useDefaultLayoutLang(word: keyof DefaultLayoutTranslations) {
  const { translations } = React.useContext(DefaultLayoutContext);
  return translations?.[word] ?? word;
}
