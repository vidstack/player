import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import { type MediaSrc } from 'vidstack';

function Player() {
  const [src, setSrc] = useState<MediaSrc>();

  useEffect(() => {
    async function getMediaStream() {
      // Audio
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setSrc({ src: audioStream, type: 'audio/object' });

      // Video
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setSrc({ src: videoStream, type: 'video/object' });
    }

    getMediaStream();
  }, []);

  return (
    <MediaPlayer src={src}>
      <MediaProvider />
    </MediaPlayer>
  );
}
