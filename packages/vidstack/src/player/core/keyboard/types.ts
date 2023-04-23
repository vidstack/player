export type MediaKeyTarget = 'document' | 'player';

export interface MediaKeyShortcuts {
  togglePaused?: string | null;
  toggleMuted?: string | null;
  toggleFullscreen?: string | null;
  togglePictureInPicture?: string | null;
  toggleCaptions?: string | null;
  seekBackward?: string | null;
  seekForward?: string | null;
  volumeUp?: string | null;
  volumeDown?: string | null;
}

export type MediaKeyShortcut = keyof MediaKeyShortcuts;
