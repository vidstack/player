import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';

function Player() {
  const [src, setSrc] = useState<MediaStream>();

  useEffect(() => {
    async function getVideoStream() {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setSrc(mediaStream);
    }

    getVideoStream();
  }, []);

  return (
    <MediaPlayer src={src} controls>
      <MediaProvider />
    </MediaPlayer>
  );
}
