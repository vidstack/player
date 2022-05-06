import { Media, MediaSync, Video } from '@vidstack/player/react';

export default () => {
  return (
    <>
      <Media>
        <MediaSync singlePlayback>
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
          </Video>
        </MediaSync>
      </Media>

      <Media>
        <MediaSync singlePlayback>
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
          </Video>
        </MediaSync>
      </Media>
    </>
  );
};
