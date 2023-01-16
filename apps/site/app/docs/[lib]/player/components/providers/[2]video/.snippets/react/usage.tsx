import { Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Video controls poster="https://media-files.vidstack.io/poster.png">
      <video preload="none" src="https://media-files.vidstack.io/720p.mp4" />
    </Video>
  );
}
