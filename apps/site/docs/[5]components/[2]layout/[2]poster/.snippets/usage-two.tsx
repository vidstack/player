import { MediaPlayer, MediaPoster, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer poster="https://media-files.vidstack.io/poster.png" aspectRatio={16 / 9}>
      <MediaProvider>
        <MediaPoster alt="Agent 327 blowing flames with a hair dryer." />
      </MediaProvider>
    </MediaPlayer>
  );
}
