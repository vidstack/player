import { MediaPlayer, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer
      src="https://media-files.vidstack.io/720p.mp4"
      poster="https://media-files.vidstack.io/poster.png"
      controls
    >
      <MediaProvider />
    </MediaPlayer>
  );
}
