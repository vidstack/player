import { FullscreenButton, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <FullscreenButton>
        <svg slot="enter">{/* ... */}</svg>
        <svg slot="exit">{/* ... */}</svg>
      </FullscreenButton>
    </Media>
  );
}
