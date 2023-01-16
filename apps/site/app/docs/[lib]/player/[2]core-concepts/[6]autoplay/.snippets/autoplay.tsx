import { Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Video autoplay>
      {/* Do not set autoplay on media element. */}
      <video></video>
    </Video>
  );
}
