import { Media, Poster, Video } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      <Video poster="https://media-files.vidstack.io/poster.png">{/* ... */}</Video>
      <Poster alt="Agent 327 blowing flames with a hair dryer." />
    </Media>
  );
}
