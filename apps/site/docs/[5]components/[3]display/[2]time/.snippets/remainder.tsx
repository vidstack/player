import { MediaPlayer, MediaTime } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      {/* Displays the amount of time remaining until playback ends. */}
      <MediaTime type="current" remainder />
    </MediaPlayer>
  );
}
