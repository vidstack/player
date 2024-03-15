import type { ReadSignal } from 'maverick.js';

export type DefaultLayoutWord =
  | 'Announcements'
  | 'Accessibility'
  | 'AirPlay'
  | 'Audio'
  | 'Auto'
  | 'Boost'
  | 'Captions'
  | 'Caption Styles'
  | 'Captions look like this'
  | 'Chapters'
  | 'Closed-Captions Off'
  | 'Closed-Captions On'
  | 'Connected'
  | 'Continue'
  | 'Connecting'
  | 'Default'
  | 'Disabled'
  | 'Disconnected'
  | 'Display Background'
  | 'Download'
  | 'Enter Fullscreen'
  | 'Enter PiP'
  | 'Exit Fullscreen'
  | 'Exit PiP'
  | 'Font'
  | 'Family'
  | 'Fullscreen'
  | 'Google Cast'
  | 'Keyboard Animations'
  | 'LIVE'
  | 'Loop'
  | 'Mute'
  | 'Normal'
  | 'Off'
  | 'Pause'
  | 'Play'
  | 'Playback'
  | 'PiP'
  | 'Quality'
  | 'Replay'
  | 'Reset'
  | 'Seek Backward'
  | 'Seek Forward'
  | 'Seek'
  | 'Settings'
  | 'Skip To Live'
  | 'Speed'
  | 'Size'
  | 'Color'
  | 'Opacity'
  | 'Shadow'
  | 'Text'
  | 'Text Background'
  | 'Track'
  | 'Unmute'
  | 'Volume';

export type DefaultLayoutTranslations = {
  [word in DefaultLayoutWord]: string;
};

export function i18n(
  translations: ReadSignal<Partial<DefaultLayoutTranslations> | null>,
  word: string,
) {
  return translations()?.[word] ?? word;
}
