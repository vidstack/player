import { Media, Video } from '@vidstack/player-react';

function MediaPlayer() {
  return (
    <Media>
      <Video loading="idle">{/* ... */}</Video>
    </Media>
  );
}
