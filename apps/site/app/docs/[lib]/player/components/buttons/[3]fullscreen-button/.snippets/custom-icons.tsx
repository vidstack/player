import { MediaFullscreenButton, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaFullscreenButton>
        <svg slot="enter">{/* ... */}</svg>
        <svg slot="exit">{/* ... */}</svg>
      </MediaFullscreenButton>
    </MediaPlayer>
  );
}
