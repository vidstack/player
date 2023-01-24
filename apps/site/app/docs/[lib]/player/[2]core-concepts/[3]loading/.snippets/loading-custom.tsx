import { Media } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);

  useEffect(() => {
    // Call whenever you like - also available on `useMediaRemote`.
    media.current!.startLoadingMedia();
  }, []);

  return (
    <Media load="custom" ref={media}>
      {/* ... */}
    </Media>
  );
}
