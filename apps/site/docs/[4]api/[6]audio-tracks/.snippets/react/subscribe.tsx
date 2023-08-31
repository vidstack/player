import { MediaPlayer, useMediaStore } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  const { audioTracks, audioTrack } = useMediaStore(player);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
