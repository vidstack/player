import { Media, PlayButton } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <PlayButton>
        <div className="media-play">Play</div>
        <div className="media-pause">Pause</div>
      </PlayButton>
    </Media>
  );
}
