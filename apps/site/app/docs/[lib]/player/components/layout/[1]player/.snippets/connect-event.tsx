import { useEffect, useRef } from 'react';
import { type MediaPlayerConnectEvent } from 'vidstack';

function Player() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    container.current!.addEventListener(
      'media-player-connect',
      (event: MediaPlayerConnectEvent) => {
        const player = event.detail; // <media-player>
        // ...
      },
      { once: true },
    );
  }, []);

  return <div ref={container}>{/* `<media-player>` is a child. */}</div>;
}
