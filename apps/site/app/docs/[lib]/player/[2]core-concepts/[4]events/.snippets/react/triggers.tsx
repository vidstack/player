import { MediaPlayer } from '@vidstack/react';
import { type MediaPlayEvent } from 'vidstack';

function Player() {
  function onPlay(event: MediaPlayEvent) {
    // the event that triggered the media play request
    const origin = event.originEvent; // e.g., PointerEvent

    // was this triggered by an actual person?
    const userPlayed = event.isOriginTrusted;

    // equivalent to above
    const isTrusted = event.originEvent?.isTrusted;
  }

  return <MediaPlayer onPlay={onPlay}>{/* ... */}</MediaPlayer>;
}
