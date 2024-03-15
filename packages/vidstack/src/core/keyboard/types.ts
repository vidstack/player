import type { MediaPlayer } from '../../components/player';
import type { MediaRemoteControl } from '../state/remote-control';

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

  /** @deprecated - use `onKeyUp` or `onKeyDown` */
  callback?(event: KeyboardEvent, remote: MediaRemoteControl): void;

  onKeyUp?(context: {
    event: KeyboardEvent;
    player: MediaPlayer;
    remote: MediaRemoteControl;
  }): void;

  onKeyDown?(context: {
    event: KeyboardEvent;
    player: MediaPlayer;
    remote: MediaRemoteControl;
  }): void;
}
