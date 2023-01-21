import { Media } from '@vidstack/react';
import type { MediaPlayEvent, PlayRequestEvent } from 'vidstack';

function MediaPlayer() {
  // 1. request is made.
  function onPlayRequest(event: PlayRequestEvent) {
    console.log('play request was made.');
  }

  // 2. request is satisfied.
  function onPlay(event: MediaPlayEvent) {
    // request events are attached to media events.
    const playRequestEvent = event.request;
    console.log('play request was satisfied.');
  }

  return (
    <Media onPlayRequest={onPlayRequest} onPlay={onPlay}>
      {/* ... */}
    </Media>
  );
}
