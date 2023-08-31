import { MediaPlayer, MediaTime } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      <MediaTime type="current" />;
    </MediaPlayer>
  );
}
