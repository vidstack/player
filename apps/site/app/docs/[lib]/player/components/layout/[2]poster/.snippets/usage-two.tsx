import { MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer poster="https://media-files.vidstack.io/poster.png" aspect-ratio={16 / 9}>
      <MediaOutlet>
        <MediaPoster alt="Agent 327 blowing flames with a hair dryer." />
      </MediaOutlet>
    </MediaPlayer>
  );
}
