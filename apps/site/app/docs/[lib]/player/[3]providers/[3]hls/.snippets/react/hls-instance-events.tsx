import { MediaPlayer } from '@vidstack/react';
import type { HLSDestroyingEvent, HLSInstanceEvent } from 'vidstack';

function Player() {
  function onInstance(event: HLSInstanceEvent) {
    const hls = event.detail;
  }

  function onDestroy(event: HLSDestroyingEvent) {
    // ...
  }

  return (
    <MediaPlayer onHlsInstance={onInstance} onHlsDestroying={onDestroy}>
      {/* ... */}
    </MediaPlayer>
  );
}
