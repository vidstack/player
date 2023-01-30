import { MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    // Call whenever you like - also available on `useMediaRemote`.
    player.current!.startLoading();
  }, []);

  return (
    <MediaPlayer load="custom" ref={player}>
      {/* ... */}
    </MediaPlayer>
  );
}
