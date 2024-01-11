import { createContext, useContext, type ReadSignal } from 'maverick.js';

import type { ThumbnailSrc } from '../../ui/thumbnails/thumbnail-loader';
import type { DefaultLayoutProps } from './props';
import type { DefaultLayoutTranslations } from './translations';

export interface DefaultLayoutContext {
  disableTimeSlider: ReadSignal<boolean>;
  menuContainer: HTMLElement | null;
  menuGroup: ReadSignal<DefaultLayoutProps['menuGroup']>;
  noGestures: ReadSignal<boolean>;
  noKeyboardActionDisplay: ReadSignal<boolean>;
  noModal: ReadSignal<DefaultLayoutProps['noModal']>;
  sliderChaptersMinWidth: ReadSignal<DefaultLayoutProps['sliderChaptersMinWidth']>;
  smWhen: ReadSignal<boolean>;
  thumbnails: ReadSignal<ThumbnailSrc>;
  translations: ReadSignal<Partial<DefaultLayoutTranslations> | null>;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
