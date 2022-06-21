import { Media, PlayButton } from '@vidstack/player-react';

function MediaPlayer() {
  return (
    <Media>
      <PlayButton>
        {/* play Icon. */}
        <svg className="media-paused:opacity-100 opacity-0"></svg>
        {/* pause Icon. */}
        <svg className="media-paused:opacity-0 opacity-100"></svg>
      </PlayButton>
    </Media>
  );
}
