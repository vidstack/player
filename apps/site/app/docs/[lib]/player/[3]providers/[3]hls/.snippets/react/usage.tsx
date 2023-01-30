import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer
      src="https://media-files.vidstack.io/hls/index.m3u8"
      poster="https://media-files.vidstack.io/poster.png"
      controls
      view="video"
    >
      <MediaOutlet />
    </MediaPlayer>
  );
}
