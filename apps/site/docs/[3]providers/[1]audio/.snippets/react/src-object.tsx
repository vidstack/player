import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import { type MediaSrc } from 'vidstack';

function Player() {
  const [src, setSrc] = useState<MediaSrc[]>();

  useEffect(() => {
    async function getAudioStream() {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we don't set the `type` it will be passed to the video provider.
      setSrc([{ src: mediaStream, type: 'audio/object' }]);
    }

    getAudioStream();
  }, []);

  return (
    <MediaPlayer src={src} controls>
      <MediaProvider />
    </MediaPlayer>
  );
}
