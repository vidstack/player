import { Media, MediaSync, Video } from '@vidstack/player/react';

function MediaPlayers() {
  return (
    <>
      <Media>
        <MediaSync>
          <Video></Video>
        </MediaSync>
      </Media>

      <Media>
        <MediaSync>
          <Video></Video>
        </MediaSync>
      </Media>
    </>
  );
}
