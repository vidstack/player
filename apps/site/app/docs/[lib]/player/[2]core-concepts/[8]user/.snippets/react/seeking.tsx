import { MediaPlayer } from '@vidstack/react';
import type { MediaSeekingRequestEvent, MediaSeekRequestEvent } from 'vidstack';

function Player() {
  // 1. seeking started
  function onSeekingRequest(event: MediaSeekingRequestEvent) {
    if (event.isOriginTrusted) {
      // user performed action
    }
  }

  // 2. seeking ended
  function onSeekRequest(event: MediaSeekRequestEvent) {
    if (event.isOriginTrusted) {
      // user performed action
    }
  }

  return (
    <MediaPlayer onMediaSeekingRequest={onSeekingRequest} onMediaSeekRequest={onSeekRequest}>
      {/* ... */}
    </MediaPlayer>
  );
}
