import { MediaMuteButton, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaMuteButton>
        <svg slot="volume-muted">{/* ... */}</svg>
        <svg slot="volume-low">{/* ... */}</svg>
        <svg slot="volume-high">{/* ... */}</svg>
      </MediaMuteButton>
    </MediaPlayer>
  );
}
