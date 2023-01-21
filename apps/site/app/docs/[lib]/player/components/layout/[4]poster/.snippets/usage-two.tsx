import { AspectRatio, Media, Poster, Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media poster="https://media-files.vidstack.io/poster.png">
      <AspectRatio ratio="16/9">
        <Video>{/* ... */}</Video>
        <Poster alt="Agent 327 blowing flames with a hair dryer." />
      </AspectRatio>
    </Media>
  );
}
