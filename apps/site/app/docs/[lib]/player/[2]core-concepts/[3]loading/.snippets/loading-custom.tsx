import { Media, useMediaRemote, Video } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaElement } from 'vidstack';

function MediaPlayer() {
  const media = useRef<MediaElement>(null);
  const remote = useMediaRemote(media);

  useEffect(() => {
    // Call whenever you like.
    // Method is also available on the `<vds-video>` element.
    remote.startLoading();
  }, []);

  return (
    <Media ref={media}>
      <Video load="custom">{/* ... */}</Video>
    </Media>
  );
}
