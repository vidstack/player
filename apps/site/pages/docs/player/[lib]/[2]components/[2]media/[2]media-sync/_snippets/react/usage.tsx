import { Media, MediaSync, Video } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      <MediaSync>
        {/* Does not have to be a direct child. */}
        <Video>{/* ... */}</Video>
      </MediaSync>
    </Media>
  );
}
