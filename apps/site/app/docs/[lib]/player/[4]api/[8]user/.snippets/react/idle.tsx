import { MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    return player.current!.subscribe(({ controlsVisible }) => {
      if (controlsVisible) {
        // ...
      }
    });
  }, []);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
