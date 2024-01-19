import type { ReadSignal } from 'maverick.js';

export type PlyrLayoutWord =
  | 'Ad'
  | 'All'
  | 'AirPlay'
  | 'Audio'
  | 'Auto'
  | 'Buffered'
  | 'Captions'
  | 'Current time'
  | 'Default'
  | 'Disable captions'
  | 'Disabled'
  | 'Download'
  | 'Duration'
  | 'Enable captions'
  | 'Enabled'
  | 'End'
  | 'Enter Fullscreen'
  | 'Exit Fullscreen'
  | 'Forward'
  | 'Go back to previous menu'
  | 'LIVE'
  | 'Loop'
  | 'Mute'
  | 'Normal'
  | 'Pause'
  | 'Enter PiP'
  | 'Exit PiP'
  | 'Play'
  | 'Played'
  | 'Quality'
  | 'Reset'
  | 'Restart'
  | 'Rewind'
  | 'Seek'
  | 'Settings'
  | 'Speed'
  | 'Start'
  | 'Unmute'
  | 'Volume';

export type PlyrLayoutTranslations = {
  [word in PlyrLayoutWord]: string;
};

export function i18n(
  translations: ReadSignal<Partial<PlyrLayoutTranslations> | null>,
  word: string,
) {
  return translations()?.[word] ?? word;
}
