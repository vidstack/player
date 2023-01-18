import { Media, PlayButton } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <PlayButton>
        <svg slot="play">{/* ... */}</svg>
        <svg slot="pause">{/* ... */}</svg>
      </PlayButton>
    </Media>
  );
}
