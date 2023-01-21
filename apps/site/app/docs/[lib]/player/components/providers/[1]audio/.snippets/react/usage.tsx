import { Audio, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media controls view="audio">
      <Audio>
        <audio preload="none" src="https://media-files.vidstack.io/audio.mp3" />
      </Audio>
    </Media>
  );
}
