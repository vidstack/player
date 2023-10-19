export type MediaKeyTarget = 'document' | 'player';

export interface MediaKeyShortcuts {
  [keys: string]: MediaKeyShortcut | undefined;
  togglePaused?: MediaKeyShortcut;
  toggleMuted?: MediaKeyShortcut;
  toggleFullscreen?: MediaKeyShortcut;
  togglePictureInPicture?: MediaKeyShortcut;
  toggleCaptions?: MediaKeyShortcut;
  seekBackward?: MediaKeyShortcut;
  seekForward?: MediaKeyShortcut;
  speedUp?: MediaKeyShortcut;
  slowDown?: MediaKeyShortcut;
  volumeUp?: MediaKeyShortcut;
  volumeDown?: MediaKeyShortcut;
}

export type MediaKeyShortcut = MediaKeysCallback | string | string[] | null;

export interface MediaKeysCallback {
  keys: string | string[];
  callback(event: KeyboardEvent): void;
}
