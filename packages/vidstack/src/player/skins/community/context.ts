import { createContext, useContext, type ReadSignal, type ReadSignalRecord } from 'maverick.js';

import type { MediaStore } from '../../core/api/store';
import type { CommunitySkinProps } from './skin';

export interface CommunitySkinContext {
  $props: ReadSignalRecord<CommunitySkinProps>;
  $media: MediaStore;
}

export interface CommunitySkinTranslations {
  Audio: string;
  Auto: string;
  Captions: string;
  Chapters: string;
  Default: string;
  Mute: string;
  Normal: string;
  Off: string;
  Pause: string;
  Play: string;
  Speed: string;
  Quality: string;
  Settings: string;
  Unmute: string;
  'Seek Forward': string;
  'Seek Backward': string;
  'Closed-Captions On': string;
  'Closed-Captions Off': string;
  'Enter Fullscreen': string;
  'Exit Fullscreen': string;
  'Enter PiP': string;
  'Exit PiP': string;
}

export function i18n(
  translations: ReadSignal<CommunitySkinTranslations | null>,
  key: keyof CommunitySkinTranslations,
) {
  return translations()?.[key] ?? key;
}

export const communitySkinContext = createContext<CommunitySkinContext>();

export function useCommunitySkin() {
  return useContext(communitySkinContext);
}

export function useCommunitySkinI18n() {
  return useCommunitySkin().$props.translations;
}
