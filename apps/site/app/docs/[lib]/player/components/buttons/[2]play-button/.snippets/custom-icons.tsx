import { MediaPlayButton, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaPlayButton>
        <svg slot="play">{/* ... */}</svg>
        <svg slot="pause">{/* ... */}</svg>
      </MediaPlayButton>
    </MediaPlayer>
  );
}
