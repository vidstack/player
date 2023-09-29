import { MediaPlayer, MediaSeekButton } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* seek forwards */}
      <MediaSeekButton seconds={+30} />
      {/* seek backwards */}
      <MediaSeekButton seconds={-30} />
    </MediaPlayer>
  );
}
