import { Media, PlayButton } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <PlayButton>
        <svg className="play-icon">{/* ... */}</svg>
        <svg className="pause-icon">{/* ... */}</svg>
      </PlayButton>
    </Media>
  );
}
