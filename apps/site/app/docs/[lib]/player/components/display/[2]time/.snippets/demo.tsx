import { MediaPlayer, MediaTime } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTime type="current" />
      <MediaTime type="buffered" />
      <MediaTime type="duration" />
      <MediaTime type="current" remainder />
    </MediaPlayer>
  );
}
