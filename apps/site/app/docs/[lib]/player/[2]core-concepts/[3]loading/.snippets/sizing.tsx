import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer aspectRatio={16 / 9}>
      <MediaOutlet />
    </MediaPlayer>
  );
}
