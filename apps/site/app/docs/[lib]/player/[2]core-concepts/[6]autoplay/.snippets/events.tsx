import { Media } from '@vidstack/react';
import { type MediaAutoplayEvent, type MediaAutoplayFailEvent } from 'vidstack';

function MediaPlayer() {
  function onAutoplay(event: MediaAutoplayEvent) {
    // autoplay has successfully started.
  }

  function onAutoplayFail(event: MediaAutoplayFailEvent) {
    // autoplay has failed.
    console.log(event.detail.muted); // was media muted?
    console.log(event.detail.error); // media error
  }

  return (
    <Media autoplay onAutoplay={onAutoplay} onAutoplayFail={onAutoplayFail}>
      {/* ... */}
    </Media>
  );
}
