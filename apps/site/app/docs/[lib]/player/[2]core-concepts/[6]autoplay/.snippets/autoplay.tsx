import { Media, Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media autoplay>
      <Video>
        {/* Do not set autoplay on media element. */}
        <video></video>
      </Video>
    </Media>
  );
}
