import { MediaPlayer } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  async function manageFullscreen() {
    try {
      await player.current!.enterFullscreen();
    } catch (e) {
      // This will generally throw if:
      // 1. Fullscreen API is not available.
      // 2. Or, the user has not interacted with the document yet.
    }

    // ...

    try {
      await player.current!.exitFullscreen();
    } catch (e) {
      // This will generally throw if:
      // 1. Fullscreen API is not available.
    }
  }

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
