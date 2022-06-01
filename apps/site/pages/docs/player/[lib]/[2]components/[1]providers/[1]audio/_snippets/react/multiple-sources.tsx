import { Audio } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Audio>
      <audio preload="none">
        <source src="https://media-files.vidstack.io/audio.mp3" type="audio/mpeg" />
        <source src="https://media-files.vidstack.io/audio.ogg" type="audio/ogg" />
        Your browser doesn't support the HTML5 <code>audio</code> tag.
      </audio>
    </Audio>
  );
}
