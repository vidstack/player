import { AspectRatio, Media } from '@vidstack/player-react';

function MediaPlayer() {
  return (
    <Media>
      <AspectRatio ratio="16/9">{/* provider here. */}</AspectRatio>
    </Media>
  );
}
