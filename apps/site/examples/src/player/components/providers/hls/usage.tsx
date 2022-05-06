import { Hls, Media } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <Hls controls poster="https://media-files.vidstack.io/poster.png">
        <video
          controls
          preload="none"
          src="https://media-files.vidstack.io/hls/index.m3u8"
          poster="https://media-files.vidstack.io/poster-seo.png"
        ></video>
      </Hls>
    </Media>
  );
};
