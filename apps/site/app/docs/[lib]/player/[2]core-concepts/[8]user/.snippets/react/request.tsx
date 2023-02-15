import { MediaPlayer } from '@vidstack/react';
import type { MediaPlayEvent } from 'vidstack';

function Player() {
  function onMediaPlay(event: MediaPlayEvent) {
    const originEvent = event.originEvent; // E.g., PointerEvent
    if (originEvent?.isTrusted) {
      // user performed action
    }
  }

  return <MediaPlayer onPlay={onMediaPlay}>{/* ... */}</MediaPlayer>;
}
