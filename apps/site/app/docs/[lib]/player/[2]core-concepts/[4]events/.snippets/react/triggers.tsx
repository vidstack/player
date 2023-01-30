import { MediaPlayer } from '@vidstack/react';
import {
  hasTriggerEvent,
  walkTriggerEventChain,
  type MediaPlayEvent,
  type MediaPlayingEvent,
} from 'vidstack';

function Example() {
  function onPlay(event: MediaPlayEvent) {
    // was this triggered by an actual person?
    const userPlayed = event.isOriginTrusted;
    // equivalent to above
    const isTrusted = event.originEvent.isTrusted;
  }

  function onPlaying(event: MediaPlayingEvent) {
    // walk through each trigger event in the chain.
    walkTriggerEventChain(event, (trigger) => {
      console.log(trigger);
    });

    // is this resuming from buffering?
    if (hasTriggerEvent(event, 'waiting')) {
      // ...
    }
  }

  return (
    <MediaPlayer onPlay={onPlay} onPlaying={onPlaying}>
      {/* ... */}
    </MediaPlayer>
  );
}
