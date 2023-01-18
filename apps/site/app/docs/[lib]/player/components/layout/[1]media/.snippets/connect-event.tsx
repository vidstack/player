import { useEffect, useRef } from 'react';
import { type MediaConnectEvent } from 'vidstack';

function MediaPlayer() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    container.current!.addEventListener(
      'media-connect',
      (event: MediaConnectEvent) => {
        const mediaElement = event.detail; // <vds-media>
        const currentProvider = mediaElement.provider;
        // ...
      },
      { once: true },
    );
  }, []);

  return <div ref={container}>{/* `<vds-media>` is a child. */}</div>;
}
