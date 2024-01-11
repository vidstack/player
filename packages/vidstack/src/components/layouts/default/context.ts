import { createContext, useContext, type ReadSignal } from 'maverick.js';

import type { PlayerQueryList } from '../../../core/query-list';
import type { ThumbnailSrc } from '../../ui/thumbnails/thumbnail-loader';
import type { DefaultLayoutProps } from './props';
import type { DefaultLayoutTranslations } from './translations';

export interface DefaultLayoutContext {
  smQueryList: PlayerQueryList;
  thumbnails: ReadSignal<ThumbnailSrc>;
  translations: ReadSignal<Partial<DefaultLayoutTranslations> | null>;
  noModal: ReadSignal<DefaultLayoutProps['noModal']>;
  menuGroup: ReadSignal<DefaultLayoutProps['menuGroup']>;
  sliderChaptersMinWidth: ReadSignal<DefaultLayoutProps['sliderChaptersMinWidth']>;
  menuContainer: HTMLElement | null;
  disableTimeSlider: ReadSignal<boolean>;
  noGestures: ReadSignal<boolean>;
  noKeyboardActionDisplay: ReadSignal<boolean>;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
