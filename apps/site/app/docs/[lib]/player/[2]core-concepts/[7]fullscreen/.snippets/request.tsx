import { Media } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);

  async function manageFullscreen() {
    try {
      await media.current!.enterFullscreen();
    } catch (e) {
      // This will generally throw if:
      // 1. Fullscreen API is not available.
      // 2. Or, the user has not interacted with the document yet.
    }

    // ...

    try {
      await media.current!.exitFullscreen();
    } catch (e) {
      // This will generally throw if:
      // 1. Fullscreen API is not available.
    }
  }

  return <Media ref={media}>{/* ... */}</Media>;
}
