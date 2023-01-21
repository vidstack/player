import { Media, Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media controls poster="https://media-files.vidstack.io/poster.png" view="video">
      <Video>
        <video preload="none" src="https://media-files.vidstack.io/720p.mp4" />
      </Video>
    </Media>
  );
}
