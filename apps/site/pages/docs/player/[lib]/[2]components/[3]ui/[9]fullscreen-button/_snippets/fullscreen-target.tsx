import { FullscreenButton, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <FullscreenButton fullscreenTarget="provider" />
    </Media>
  );
}
