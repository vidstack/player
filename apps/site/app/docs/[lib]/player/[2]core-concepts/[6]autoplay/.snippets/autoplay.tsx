import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer autoplay>
      <MediaOutlet />
    </MediaPlayer>
  );
}
