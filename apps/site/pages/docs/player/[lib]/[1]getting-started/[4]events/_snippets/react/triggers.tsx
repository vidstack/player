import {
  hasTriggerEvent,
  type MediaPlayEvent,
  type MediaPlayingEvent,
  walkTriggerEventChain,
} from '@vidstack/player';
import { Media, Video } from '@vidstack/player/react';

function Example() {
  function onPlay(event: MediaPlayEvent) {
    // Was this triggered by an actual person?
    const userPlayed = event.isOriginTrusted;

    // Equivalent
    const isTrusted = userPlayed.originEvent.isTrusted;
  }

  function onPlaying(event: MediaPlayingEvent) {
    // Walk through each trigger event in the chain.
    walkTriggerEventChain(event, (trigger) => {
      console.log(trigger);
    });

    // Is this resuming from buffering?
    if (hasTriggerEvent(event, 'vds-waiting')) {
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
