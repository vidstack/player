import { MediaPlayer, useMediaStore } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);
  // - This is a live subscription to the media paused state.
  // - All subscriptions are lazily created on prop access.
  const { paused } = useMediaStore(player);
  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
