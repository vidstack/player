import { MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer poster="https://media-files.vidstack.io/poster.png">
      <MediaOutlet />
      <MediaPoster alt="Agent 327 blowing flames with a hair dryer." />
    </MediaPlayer>
  );
}
