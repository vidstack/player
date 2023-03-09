import { MediaPlayer } from '@vidstack/react';
import { type MediaPlayingEvent } from 'vidstack';

function Player() {
  function onPlaying(event: MediaPlayingEvent) {
    // the event that triggered the media play request
    const origin = event.originEvent; // e.g., PointerEvent

    // was this triggered by an actual person?
    const userPlayed = event.isOriginTrusted;

    // equivalent to above
    const isTrusted = event.originEvent?.isTrusted;
  }

  return <MediaPlayer onPlaying={onPlaying}>{/* ... */}</MediaPlayer>;
}
