import { MediaPlayer, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer src="https://media-files.vidstack.io/audio.mp3" controls>
      <MediaProvider />
    </MediaPlayer>
  );
}
