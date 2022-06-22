import { type MediaElement } from '@vidstack/player';
import { Media, useMediaRemote, Video } from '@vidstack/player-react';
import { useEffect, useRef } from 'react';

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
