import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer aspect-ratio={16 / 9}>
      <MediaOutlet />
    </MediaPlayer>
  );
}
