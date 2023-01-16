import { AspectRatio, Media, Video } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        {/* Must be direct child. */}
        <Video>{/* ... */}</Video>
      </AspectRatio>
    </Media>
  );
}
