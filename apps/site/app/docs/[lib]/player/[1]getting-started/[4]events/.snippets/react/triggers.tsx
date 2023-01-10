import { Media, Video } from '@vidstack/react';
import {
  hasTriggerEvent,
  walkTriggerEventChain,
  type MediaPlayEvent,
  type MediaPlayingEvent,
} from 'vidstack';

function Example() {
  function onPlay(event: MediaPlayEvent) {
    // Was this triggered by an actual person?
    const userPlayed = event.isOriginTrusted;

    // Equivalent
    const isTrusted = event.originEvent.isTrusted;
  }

  function onPlaying(event: MediaPlayingEvent) {
    // Walk through each trigger event in the chain.
    walkTriggerEventChain(event, (trigger) => {
      console.log(trigger);
    });

    // Is this resuming from buffering?
    if (hasTriggerEvent(event, 'waiting')) {
      // ...
    }
  }

  return (
    <Media>
      <Video onPlay={onPlay} onPlaying={onPlaying}>
        {/* ... */}
      </Video>
    </Media>
  );
}
