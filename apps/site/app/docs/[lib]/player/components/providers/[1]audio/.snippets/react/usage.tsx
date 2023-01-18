import { Audio } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Audio controls>
      <audio preload="none" src="https://media-files.vidstack.io/audio.mp3" />
    </Audio>
  );
}
