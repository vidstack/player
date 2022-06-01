import { Media, Time } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      {/* Displays the amount of time remaining until playback ends. */}
      <Time type="current" remainder />;
    </Media>
  );
}
