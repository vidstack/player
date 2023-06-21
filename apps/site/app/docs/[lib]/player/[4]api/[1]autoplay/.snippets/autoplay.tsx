import { MediaPlayer, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer autoplay>
      <MediaProvider />
    </MediaPlayer>
  );
}
