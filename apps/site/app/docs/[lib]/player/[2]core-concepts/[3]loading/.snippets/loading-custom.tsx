import { Media, useCustomElement } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { MediaElement } from 'vidstack';

function MediaPlayer() {
  const mediaRef = useRef<MediaElement>(null),
    media = useCustomElement(mediaRef);

  useEffect(() => {
    if (!media) return;
    // Call whenever you like - also available on `useMediaRemote`.
    media.startLoadingMedia();
  }, [media]);

  return (
    <Media load="custom" ref={mediaRef}>
      {/* ... */}
    </Media>
  );
}
