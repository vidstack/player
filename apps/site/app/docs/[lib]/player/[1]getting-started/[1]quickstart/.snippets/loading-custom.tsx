import { Media, useMediaRemote, Video } from '@vidstack/react';
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
    <Media ref={media}>
      <Video loading="custom">{/* ... */}</Video>
    </Media>
  );
}
