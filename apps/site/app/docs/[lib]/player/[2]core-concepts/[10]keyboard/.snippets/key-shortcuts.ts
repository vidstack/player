// Default shortcuts.
import { MEDIA_KEY_SHORTCUTS } from 'vidstack';

const player = document.querySelector('media-player');
player.onAttach(() => {
  player.keyShortcuts = {
    togglePaused: 'k Space',
    toggleMuted: 'm',
    toggleFullscreen: 'f',
    seekBackward: 'ArrowLeft',
    seekForward: 'ArrowRight',
    volumeUp: 'ArrowUp',
    volumeDown: 'ArrowDown',
  };
});
