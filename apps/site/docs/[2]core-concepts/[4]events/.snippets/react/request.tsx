import { MediaPlayer } from '@vidstack/react';
import type { MediaPlayEvent, MediaPlayFailEvent, MediaPlayRequestEvent } from 'vidstack';

function Player() {
  // 1. request was made
  function onMediaPlayRequest(event: MediaPlayRequestEvent) {
    // ...
  }

  // 2. request succeeded
  function onMediaPlay(event: MediaPlayEvent) {
    // request events are attached to media events
    const playRequestEvent = event.request; // MediaPlayRequestEvent
  }

  // 2. request failed
  function onMediaPlayFail(event: MediaPlayFailEvent) {
    // ...
  }

  return (
    <MediaPlayer
      onPlay={onMediaPlay}
      onPlayFail={onMediaPlayFail}
      onMediaPlayRequest={onMediaPlayRequest}
    >
      {/* ... */}
    </MediaPlayer>
  );
}
