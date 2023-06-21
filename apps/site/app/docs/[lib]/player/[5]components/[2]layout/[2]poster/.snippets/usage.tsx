import { MediaPlayer, MediaPoster, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer poster="https://media-files.vidstack.io/poster.png">
      <MediaProvider />
      <MediaPoster alt="Agent 327 blowing flames with a hair dryer." />
    </MediaPlayer>
  );
}
