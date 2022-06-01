import { Media, MediaSync } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      <MediaSync syncVolume>{/* ... */}</MediaSync>
    </Media>
  );
}
