import { MediaPlayer } from '@vidstack/react';
import { hasTriggerEvent, walkTriggerEventChain, type MediaPlayingEvent } from 'vidstack';

function Player() {
  function onPlaying(event: MediaPlayingEvent) {
    // is this resuming from buffering?
    if (hasTriggerEvent(event, 'waiting')) {
      // ...
    }

    // walk through each trigger event in the chain
    walkTriggerEventChain(event, (trigger) => {
      console.log(trigger);
    });
  }

  return <MediaPlayer onPlaying={onPlaying}>{/* ... */}</MediaPlayer>;
}
