import { HLSVideo, Media } from '@vidstack/react';
import type { HLSDestroyingEvent, HLSInstanceEvent } from 'vidstack';

function MediaPlayer() {
  function onInstance(event: HLSInstanceEvent) {
    // `hls.js` instance.
    const hls = event.detail;
  }

  function onDestroy(event: HLSDestroyingEvent) {
    // ...
  }

  return (
    <Media>
      <HLSVideo onHlsInstance={onInstance} onHlsDestroying={onDestroy}>
        {/* ... */}
      </HLSVideo>
    </Media>
  );
}
