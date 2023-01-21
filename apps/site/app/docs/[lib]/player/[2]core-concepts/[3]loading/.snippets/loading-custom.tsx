import { Media, useMediaRemote } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);
  const remote = useMediaRemote(media);

  useEffect(() => {
    // Call whenever you like.
    remote.startLoading();
  }, []);

  return (
    <Media load="custom" ref={media}>
      {/* ... */}
    </Media>
  );
}
