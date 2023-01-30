import { MediaFullscreenButton, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      <MediaFullscreenButton target="provider" />
    </MediaPlayer>
  );
}
