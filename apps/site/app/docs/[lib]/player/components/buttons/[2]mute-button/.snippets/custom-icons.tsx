import { Media, MuteButton } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <MuteButton>
        <svg slot="volume-muted">{/* ... */}</svg>
        <svg slot="volume-low">{/* ... */}</svg>
        <svg slot="volume-high">{/* ... */}</svg>
      </MuteButton>
    </Media>
  );
}
