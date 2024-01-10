import type { ReadSignal } from 'maverick.js';

export type DefaultLayoutWord =
  | 'Closed-Captions Off'
  | 'Closed-Captions On'
  | 'Enter Fullscreen'
  | 'Enter PiP'
  | 'Exit Fullscreen'
  | 'Exit PiP'
  | 'Font Styles'
  | 'Font Family'
  | 'Font Size'
  | 'Text Color'
  | 'Text Opacity'
  | 'Text Shadow'
  | 'Background Color'
  | 'Background Opacity'
  | 'Display Background Color'
  | 'Display Background Opacity'
  | 'Reset'
  | 'Seek Backward'
  | 'Seek Forward'
  | 'AirPlay'
  | 'Audio'
  | 'Auto'
  | 'Captions'
  | 'Chapters'
  | 'Connected'
  | 'Connecting'
  | 'Disconnected'
  | 'Default'
  | 'Google Cast'
  | 'LIVE'
  | 'Mute'
  | 'Normal'
  | 'Off'
  | 'Pause'
  | 'Play'
  | 'Quality'
  | 'Seek'
  | 'Settings'
  | 'Skip To Live'
  | 'Speed'
  | 'Unmute'
  | 'Volume'
  | 'White'
  | 'Yellow'
  | 'Green'
  | 'Cyan'
  | 'Blue'
  | 'Magenta'
  | 'Red'
  | 'Black';

export type DefaultLayoutTranslations = {
  [word in DefaultLayoutWord]: string;
};

export function getDefaultLayoutLang(
  translations: ReadSignal<Partial<DefaultLayoutTranslations> | null>,
  word: string,
) {
  return translations()?.[word] ?? word;
}
